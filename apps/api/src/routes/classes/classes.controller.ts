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
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import {
  DeleteSchema,
  EditClassSchema,
  PostClassSchema,
  PostStudentSchema,
  PostSubjectSchema,
  getClassesSchema,
} from '@iglesiasbc/schemas';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(new AuthGuard('classes'))
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  read(@Query(new ZodPiPe(getClassesSchema)) query) {
    return this.classesService.read(query);
  }

  @Get(':id')
  readOne(@Param(new ZodPiPe(DeleteSchema)) params) {
    return this.classesService.readOne(params);
  }

  @Get('data/:id')
  readData(@Param(new ZodPiPe(DeleteSchema)) params) {
    return this.classesService.readData(params);
  }

  @Get('list/:id')
  downloadAssistanceList(@Param(new ZodPiPe(DeleteSchema)) params) {
    return this.classesService.downloadAssistanceList(params);
  }

  @Post()
  create(@Body(new ZodPiPe(PostClassSchema)) body) {
    return this.classesService.post(body);
  }

  @Put()
  edit(@Body(new ZodPiPe(EditClassSchema)) body) {
    return this.classesService.edit(body);
  }

  @Post('subjects')
  createSubject(@Body(new ZodPiPe(PostSubjectSchema)) body) {
    return this.classesService.postSubject(body);
  }

  @Post('students')
  createStudent(@Body(new ZodPiPe(PostStudentSchema)) body) {
    return this.classesService.postStudent(body);
  }

  @Delete(':id')
  delete(@Param(new ZodPiPe(DeleteSchema)) param) {
    return this.classesService.delete(param);
  }

  @Delete('subjects/:id')
  deleteClass(@Param(new ZodPiPe(DeleteSchema)) param) {
    return this.classesService.deleteSubject(param);
  }

  @Delete('students/:id')
  deleteStudent(@Param(new ZodPiPe(DeleteSchema)) param) {
    return this.classesService.deleteStudent(param);
  }

  @Get('stats')
  getTotal() {
    return this.classesService.getStats();
  }

  @Get('members')
  getMembers() {
    return this.classesService.getMembers();
  }
}
