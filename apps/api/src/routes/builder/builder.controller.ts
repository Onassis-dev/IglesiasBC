import {
  Controller,
  Post,
  Put,
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
  EditActivitySchema,
  UploadActivitySchema,
  UploadEventSchema,
  builderContract,
} from '@iglesiasbc/schemas';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';
import { ImageHandler } from 'src/interceptors/files/image.interceptor';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@ApiTags('Builder')
@Controller()
@UseGuards(new AuthGuard('website'))
export class BuilderController {
  constructor(private readonly builderService: BuilderService) {}

  @TsRestHandler(builderContract.getWebsiteInfo)
  getWebsiteInfo() {
    return tsRestHandler(builderContract.getWebsiteInfo, async () =>
      this.builderService.getWebsiteInfo(),
    );
  }

  @TsRestHandler(builderContract.getStart)
  getStart() {
    return tsRestHandler(builderContract.getStart, async () =>
      this.builderService.getStart(),
    );
  }

  @TsRestHandler(builderContract.editStart)
  editStart() {
    return tsRestHandler(builderContract.editStart, async ({ body }) =>
      this.builderService.editStart(body),
    );
  }

  @TsRestHandler(builderContract.getWebsite)
  getWebsite() {
    return tsRestHandler(builderContract.getWebsite, async () =>
      this.builderService.getWebsite(),
    );
  }

  @TsRestHandler(builderContract.createWebsite)
  createWebsite() {
    return tsRestHandler(builderContract.createWebsite, async ({ body }) =>
      this.builderService.createWebsite(body),
    );
  }

  @TsRestHandler(builderContract.editWebsite)
  editWebsite() {
    return tsRestHandler(builderContract.editWebsite, async ({ body }) =>
      this.builderService.editWebsite(body),
    );
  }

  @TsRestHandler(builderContract.getLogo)
  getLogo() {
    return tsRestHandler(builderContract.getLogo, async () =>
      this.builderService.getLogo(),
    );
  }

  @Post('builder/logo')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(300, 100, true))
  uploadLogo(@UploadedFile() file: File) {
    return this.builderService.uploadLogo(file);
  }

  @TsRestHandler(builderContract.getPastorsImg)
  getPastorsImg() {
    return tsRestHandler(builderContract.getPastorsImg, async () =>
      this.builderService.getPastorsImg(),
    );
  }

  @Post('builder/pastorsimg')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(700))
  uploadPastorsImg(@UploadedFile() file: File) {
    return this.builderService.uploadPastorsImg(file);
  }

  @TsRestHandler(builderContract.getCoverImg)
  getCoverImg() {
    return tsRestHandler(builderContract.getCoverImg, async () =>
      this.builderService.getCoverImg(),
    );
  }

  @Post('builder/coverimg')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(1400))
  uploadCoverImg(@UploadedFile() file: File) {
    return this.builderService.uploadCoverImg(file);
  }

  @TsRestHandler(builderContract.getEvents)
  getEvents() {
    return tsRestHandler(builderContract.getEvents, async () =>
      this.builderService.getEvents(),
    );
  }

  @Post('builder/event')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(800))
  uploadEvent(
    @Query(new ZodPiPe(UploadEventSchema)) query,
    @UploadedFile() file: File,
  ) {
    return this.builderService.uploadEvent(query, file);
  }

  @TsRestHandler(builderContract.deleteEvent)
  deleteEvent() {
    return tsRestHandler(builderContract.deleteEvent, async ({ body }) =>
      this.builderService.deleteEvent(body),
    );
  }

  @TsRestHandler(builderContract.getChurchImages)
  getChurchImages() {
    return tsRestHandler(builderContract.getChurchImages, async () =>
      this.builderService.getChurchImages(),
    );
  }

  @Post('builder/image')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  uploadChurchImage(@UploadedFile() file: File) {
    return this.builderService.uploadChurchImage(file);
  }

  @TsRestHandler(builderContract.deleteChurchImage)
  deleteChurchImage() {
    return tsRestHandler(builderContract.deleteChurchImage, async ({ body }) =>
      this.builderService.deleteChurchImage(body),
    );
  }

  @TsRestHandler(builderContract.getActivities)
  getActivities() {
    return tsRestHandler(builderContract.getActivities, async () =>
      this.builderService.getActivities(),
    );
  }

  @Post('builder/activity')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  uploadActivity(
    @Query(new ZodPiPe(UploadActivitySchema)) query,
    @UploadedFile() file: File,
  ) {
    return this.builderService.uploadActivity(query, file);
  }

  @Put('builder/activity')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  editActivity(
    @Query(new ZodPiPe(EditActivitySchema)) query,
    @UploadedFile() file: File,
  ) {
    return this.builderService.editActivity(query, file);
  }

  @TsRestHandler(builderContract.deleteActivity)
  deleteActivity() {
    return tsRestHandler(builderContract.deleteActivity, async ({ body }) =>
      this.builderService.deleteActivity(body),
    );
  }
}
