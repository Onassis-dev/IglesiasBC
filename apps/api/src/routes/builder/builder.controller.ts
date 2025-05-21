import {
  Controller,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BuilderService } from './builder.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { builderContract } from '@iglesiasbc/schemas';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';
import { ImageHandler } from 'src/interceptors/files/image.interceptor';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

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
      this.builderService.getImage('logo'),
    );
  }

  @TsRestHandler(builderContract.uploadLogo)
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(300, 100, true))
  uploadLogo(@UploadedFile() file: File) {
    return tsRestHandler(builderContract.uploadLogo, async () =>
      this.builderService.uploadImage(file, 'logo'),
    );
  }

  @TsRestHandler(builderContract.deleteLogo)
  deleteLogo() {
    return tsRestHandler(builderContract.deleteLogo, async () =>
      this.builderService.deleteImage('logo'),
    );
  }

  @TsRestHandler(builderContract.getPastorsImg)
  getPastorsImg() {
    return tsRestHandler(builderContract.getPastorsImg, async () =>
      this.builderService.getImage('pastorsImg'),
    );
  }

  @TsRestHandler(builderContract.uploadPastorsImg)
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(700))
  uploadPastorsImg(@UploadedFile() file: File) {
    return tsRestHandler(builderContract.uploadPastorsImg, async () =>
      this.builderService.uploadImage(file, 'pastorsImg'),
    );
  }

  @TsRestHandler(builderContract.deletePastorsImg)
  deletePastorsImg() {
    return tsRestHandler(builderContract.deletePastorsImg, async () =>
      this.builderService.deleteImage('pastorsImg'),
    );
  }

  @TsRestHandler(builderContract.getCoverImg)
  getCoverImg() {
    return tsRestHandler(builderContract.getCoverImg, async () =>
      this.builderService.getImage('coverImg'),
    );
  }

  @TsRestHandler(builderContract.uploadCoverImg)
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(1400))
  uploadCoverImg(@UploadedFile() file: File) {
    return tsRestHandler(builderContract.uploadCoverImg, async () =>
      this.builderService.uploadImage(file, 'coverImg'),
    );
  }

  @TsRestHandler(builderContract.deleteCoverImg)
  deleteCoverImg() {
    return tsRestHandler(builderContract.deleteCoverImg, async () =>
      this.builderService.deleteImage('coverImg'),
    );
  }

  @TsRestHandler(builderContract.getEvents)
  getEvents() {
    return tsRestHandler(builderContract.getEvents, async () =>
      this.builderService.getEvents(),
    );
  }

  @TsRestHandler(builderContract.uploadEvent)
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(800))
  uploadEvent(@UploadedFile() file: File) {
    return tsRestHandler(builderContract.uploadEvent, async ({ body }) =>
      this.builderService.uploadEvent(body, file),
    );
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

  @TsRestHandler(builderContract.uploadChurchImage)
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  uploadChurchImage(@UploadedFile() file: File) {
    return tsRestHandler(builderContract.uploadChurchImage, async () =>
      this.builderService.uploadChurchImage(file),
    );
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

  @TsRestHandler(builderContract.uploadActivity)
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  uploadActivity(@UploadedFile() file: File) {
    return tsRestHandler(builderContract.uploadActivity, async ({ body }) =>
      this.builderService.uploadActivity(body, file),
    );
  }

  @TsRestHandler(builderContract.editActivity)
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600))
  editActivity(@UploadedFile() file: File) {
    return tsRestHandler(builderContract.editActivity, async ({ body }) =>
      this.builderService.editActivity(body, file),
    );
  }

  @TsRestHandler(builderContract.deleteActivity)
  deleteActivity() {
    return tsRestHandler(builderContract.deleteActivity, async ({ body }) =>
      this.builderService.deleteActivity(body),
    );
  }
}
