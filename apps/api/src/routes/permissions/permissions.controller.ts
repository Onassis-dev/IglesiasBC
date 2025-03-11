import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import { DeleteSchema, EditSchema, PostSchema } from './permissions.schema';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(new AuthGuard())
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  getPermission() {
    return this.permissionsService.getPermissions();
  }

  @Post()
  createPermission(@Body(new ZodPiPe(PostSchema)) body) {
    return this.permissionsService.createPermission(body);
  }

  @Put()
  editPermission(@Body(new ZodPiPe(EditSchema)) body) {
    return this.permissionsService.editPermission(body);
  }

  @Delete(':id')
  deletePermission(@Param(new ZodPiPe(DeleteSchema)) param) {
    return this.permissionsService.deletePermission(param);
  }
}
