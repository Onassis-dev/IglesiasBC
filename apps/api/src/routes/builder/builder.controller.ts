import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BuilderService } from './builder.service';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  StartSchema,
  WebsiteSchema,
  DeleteActivitySchema,
  DeleteChurchImageSchema,
  DeleteEventSchema,
  EditActivitySchema,
  UploadActivitySchema,
  UploadEventSchema,
} from 'schemas/dist/builder.schema';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';
import { ImageHandler } from 'src/interceptors/files/image.interceptor';

@ApiTags('Builder')
@Controller('builder')
@UseGuards(new AuthGuard('website'))
export class BuilderController {
  constructor(private readonly builderService: BuilderService) {}

  @Get('website/info')
  getWebsiteInfo() {
    return this.builderService.getWebsiteInfo();
  }

  @Get('start')
  getStart() {
    return this.builderService.getStart();
  }

  @Put('start')
  editStart(@Body(new ZodPiPe(StartSchema)) body) {
    return this.builderService.editStart(body);
  }

  @Get('website')
  getWebsite() {
    return this.builderService.getWebsite();
  }

  @Post('website')
  createWebsite(@Body(new ZodPiPe(WebsiteSchema)) body) {
    return this.builderService.createWebsite(body);
  }

  @Put('website')
  editWebsite(@Body(new ZodPiPe(WebsiteSchema)) body) {
    return this.builderService.editWebsite(body);
  }

  @Get('logo')
  getLogo() {
    return this.builderService.getLogo();
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(300, 100, true))
  uploadLogo(@UploadedFile() file: File) {
    return this.builderService.uploadLogo(file);
  }

  @Get('pastorsimg')
  getPastorsImg() {
    return this.builderService.getPastorsImg();
  }

  @Post('pastorsimg')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(700))
  uploadPastorsImg(@UploadedFile() file: File) {
    return this.builderService.uploadPastorsImg(file);
  }

  @Get('coverimg')
  getCoverImg() {
    return this.builderService.getCoverImg();
  }

  @Post('coverimg')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(1400))
  uploadCoverImg(@UploadedFile() file: File) {
    return this.builderService.uploadCoverImg(file);
  }

  @Get('events')
  getEvents() {
    return this.builderService.getEvents();
  }

  @Post('event')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(800))
  uploadEvent(
    @Query(new ZodPiPe(UploadEventSchema)) query,
    @UploadedFile() file: File,
  ) {
    return this.builderService.uploadEvent(query, file);
  }

  @Delete('event')
  deleteEvent(@Body(new ZodPiPe(DeleteEventSchema)) body) {
    return this.builderService.deleteEvent(body);
  }

  @Get('images')
  getChurchImages() {
    return this.builderService.getChurchImages();
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  uploadChurchImage(@UploadedFile() file: File) {
    return this.builderService.uploadChurchImage(file);
  }

  @Delete('image')
  deleteChurchImage(@Body(new ZodPiPe(DeleteChurchImageSchema)) body) {
    return this.builderService.deleteChurchImage(body);
  }

  @Get('activities')
  getActivities() {
    return this.builderService.getActivities();
  }

  @Post('activity')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  uploadActivity(
    @Query(new ZodPiPe(UploadActivitySchema)) query,
    @UploadedFile() file: File,
  ) {
    return this.builderService.uploadActivity(query, file);
  }

  @Put('activity')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  editActivity(
    @Query(new ZodPiPe(EditActivitySchema)) query,
    @UploadedFile() file: File,
  ) {
    return this.builderService.editActivity(query, file);
  }

  @Delete('activity')
  deleteActivity(@Body(new ZodPiPe(DeleteActivitySchema)) body) {
    return this.builderService.deleteActivity(body);
  }
}
