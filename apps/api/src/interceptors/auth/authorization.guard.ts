import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';

import { auth } from 'src/utils/firebase';
import { FastifyRequest } from 'fastify';
import sql from 'src/utils/db';
import { httpCookieConfig } from 'src/utils/cookiesConfig';

type permission =
  | 'finances'
  | 'inventory'
  | 'members'
  | 'classes'
  | 'website'
  | 'certificates'
  | 'blog';

interface Request extends FastifyRequest {
  userId: number;
  churchId: number;
  plan: number;
  session: string;
  cookies: Record<string, string>;
}

const planAccess: Record<permission, number> = {
  members: 0,
  website: 1,
  blog: 1,
  certificates: 1,
  finances: 2,
  inventory: 2,
  classes: 2,
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly requiredPermission?: permission) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const req: Request = httpContext.getRequest();
    const res = httpContext.getResponse();

    return validateSession(req, res, this.requiredPermission);
  }
}

async function validateSession(
  req: Request,
  res,
  requiredPermission,
): Promise<boolean> {
  try {
    if (!(req.session || req.cookies.session)) {
      if (!req.cookies.refresh) throw new HttpException('', 401);
      return revalidateSession(
        req.cookies.refresh,
        req,
        res,
        requiredPermission,
      );
    }

    const decodedToken = await auth.verifyIdToken(
      req.session || req.cookies.session,
    );

    const [data] =
      await sql`select churches.id as "churchId", users.id as "userId", users2.plan, users2."expirationDate", permissions.*
        from permissions
        join users on users.id = permissions."userId"
        join churches on churches.id = permissions."churchId"
        join users as users2 on churches."ownerId" = users2.id      
      where users.email = ${decodedToken.email} and permissions.selected = true`;

    if (!data) {
      const [data] =
        await sql`select id from users where email = ${decodedToken.email}`;

      if (
        req.originalUrl.includes('/users') ||
        req.originalUrl.includes('/churches')
      ) {
        req.userId = data.id;
        return true;
      }

      throw new HttpException('', 400);
    }

    if (new Date() > new Date(data?.expirationDate)) data.plan = 0;

    req.userId = data?.userId;
    req.churchId = data?.churchId;
    req.plan = data?.plan;

    if (planAccess[requiredPermission] > req.plan)
      throw new HttpException('', 403);

    if (!requiredPermission) return true;
    return data['perm_' + requiredPermission];
  } catch (err) {
    if (err.status === 400) throw new HttpException('NOCHURCH', 400);
    if (err.status === 401)
      throw new HttpException('Tu sesión ah expirado', 401);
    if (err.status === 403)
      throw new HttpException(
        'Esta función no esta disponible en tu plan',
        403,
      );

    if (!err.errorInfo) {
      console.log(err);
      throw new HttpException('Error en el servidor', 500);
    }
    if (err.errorInfo?.code === 'auth/argument-error')
      return revalidateSession(
        req.cookies.refresh,
        req,
        res,
        requiredPermission,
      );
    if (err.errorInfo?.code === 'auth/id-token-expired')
      return revalidateSession(
        req.cookies.refresh,
        req,
        res,
        requiredPermission,
      );

    console.log(err);
    throw new HttpException(err, 500);
  }
}

async function revalidateSession(
  refreshToken,
  req,
  res,
  requiredPermission,
): Promise<boolean> {
  const result = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${'AIzaSyB9RucLdWENklF5Y8hAs8n2Eq2lGfGMtlU'}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    },
  );

  if (!result.ok) throw new HttpException('Tu sesión ah expirado', 401);
  const newToken = (await result.json()).access_token;

  res.setCookie('session', newToken, httpCookieConfig);
  req.session = newToken;

  return validateSession(req, res, requiredPermission);
}
