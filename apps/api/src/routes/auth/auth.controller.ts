import { Controller, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @TsRestHandler(authContract.login)
  login(@Res() response: Response) {
    return tsRestHandler(authContract.login, async ({ body }) => {
      return this.authService.login(body, response);
    });
  }

  @TsRestHandler(authContract.signup)
  signup(@Res() response: Response) {
    return tsRestHandler(authContract.signup, async ({ body }) => {
      return this.authService.signup(body, response);
    });
  }

  @TsRestHandler(authContract.google)
  signInWithGoogle(@Res() response: Response) {
    return tsRestHandler(authContract.google, async ({ body }) => {
      return this.authService.signInWithGoogle(body, response);
    });
  }

  @TsRestHandler(authContract.logout)
  logout(@Res() response: Response) {
    return tsRestHandler(authContract.logout, async () => {
      return this.authService.logout(response);
    });
  }
}
