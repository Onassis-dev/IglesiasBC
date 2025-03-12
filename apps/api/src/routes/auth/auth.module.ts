import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import { APP_PIPE } from '@nestjs/core';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_PIPE,
      useValue: ZodPiPe,
    },
  ],
})
export class AuthModule {}
