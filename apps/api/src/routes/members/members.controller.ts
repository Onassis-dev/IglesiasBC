import {
  Controller,
  UseGuards,
  Post,
  Body,
  Put,
  Get,
  Delete,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import {
  PutMemberSchema,
  PostMemberSchema,
  getSchema,
  idSchema,
} from '@iglesiasbc/schemas';
import { FileInterceptor } from '@nest-lab/fastify-multer';

@ApiTags('Members')
@Controller('members')
@UseGuards(new AuthGuard('members'))
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  get(@Query(new ZodPiPe(getSchema)) query) {
    return this.membersService.get(query);
  }

  @Get(':id')
  getSingle(@Param(new ZodPiPe(idSchema)) query) {
    return this.membersService.getSingle(query);
  }

  @Get('birthdays')
  getBirthdays() {
    return this.membersService.getBirthdays();
  }

  @Post()
  post(@Body(new ZodPiPe(PostMemberSchema)) body) {
    return this.membersService.post(body);
  }

  @Put()
  put(@Body(new ZodPiPe(PutMemberSchema)) body) {
    return this.membersService.put(body);
  }

  @Delete(':id')
  delete(@Param(new ZodPiPe(idSchema)) param) {
    return this.membersService.delete(param);
  }

  @Get('stats')
  getStats() {
    return this.membersService.getStats();
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  import(@UploadedFile() file) {
    return this.membersService.import(file);
  }
}
