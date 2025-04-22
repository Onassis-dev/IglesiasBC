import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';

import { auth } from 'src/utils/firebase';
import { FastifyRequest } from 'fastify';
import sql from 'src/utils/db';

interface Request extends FastifyRequest {
  userId: number;
  churchId: number;
  plan: number;
  session: string;
  cookies: Record<string, string>;
}

const planAccess = {
  members: 0,
  website: 1,
  blog: 1,
  certificates: 1,
  finances: 1,
  inventory: 2,
  classes: 2,
  presentations: 0,
};

type permission = keyof typeof planAccess;

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
    if (!req.headers.authorization) throw new HttpException('', 401);

    const decodedToken = await auth.verifyIdToken(
      req.headers.authorization.split(' ')[1],
    );

    const [selectedChurch] =
      await sql`select churches.id as "churchId", churches.plan, permissions.*
        from permissions
        join churches on churches.id = permissions."churchId"
      where permissions."userId" = ${decodedToken.user_id} and permissions.selected = true`;

    req.userId = decodedToken.user_id;
    req.churchId = selectedChurch?.churchId;
    req.plan = selectedChurch?.plan;

    if (!selectedChurch) {
      if (
        req.originalUrl.includes('/users') ||
        req.originalUrl.includes('/churches')
      ) {
        return true;
      } else {
        throw new HttpException('', 400);
      }
    }

    if (planAccess[requiredPermission] > req.plan)
      throw new HttpException('', 403);

    if (!requiredPermission) return true;
    return selectedChurch['perm_' + requiredPermission];
  } catch (err: any) {
    if (err instanceof HttpException) throw err;
    if (err?.status === 400) throw new HttpException('NOCHURCH', 400);
    if (err?.status === 401)
      throw new HttpException('Tu sesión ah expirado', 401);
    if (err?.status === 403)
      throw new HttpException(
        'Esta función no esta disponible en tu plan',
        403,
      );

    if (!err.errorInfo) {
      console.log(err);
      throw new HttpException('Error en el servidor', 500);
    }

    console.log(err);
    throw new HttpException(err, 500);
  }
}
