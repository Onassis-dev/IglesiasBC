import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import { loginSchema, googleSchema, signUpSchema } from '@iglesiasbc/schemas';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(new ZodPiPe(loginSchema)) body, @Res() res) {
    return this.authService.login(body, res);
  }

  @Post('signup')
  signup(@Body(new ZodPiPe(signUpSchema)) body, @Res() res) {
    return this.authService.signup(body, res);
  }

  @Post('google')
  signInWithGoogle(@Body(new ZodPiPe(googleSchema)) body, @Res() res) {
    return this.authService.signInWithGoogle(body, res);
  }

  @Post('logout')
  logout(@Res() res) {
    return this.authService.logout(res);
  }
}
