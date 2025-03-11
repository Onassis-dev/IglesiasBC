import {
  Controller,
  UseGuards,
  Res,
  Post,
  Body,
  Put,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import { SelectChurchSchema, UserSchema } from 'schemas/dist/users.schema';

@ApiTags('Users')
@Controller('users')
@UseGuards(new AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser() {
    return this.usersService.getOne();
  }

  @Get('data')
  getData() {
    return this.usersService.getData();
  }

  @Post('checkplan')
  checkPlan(@Res() res) {
    return this.usersService.checkPlan(res);
  }

  @Put()
  edituser(@Body(new ZodPiPe(UserSchema)) body) {
    return this.usersService.edit(body);
  }

  @Put('church')
  selectChurch(@Body(new ZodPiPe(SelectChurchSchema)) body) {
    return this.usersService.selectChurch(body);
  }
}
