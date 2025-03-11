import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Delete,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import {
  DeleteSchema,
  DownloadSchema,
  PostCertificateSchema,
  getSchema,
} from 'schemas/dist/certificates.schema';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';
import { ImageHandler } from 'src/interceptors/files/image.interceptor';

@ApiTags('Certificates')
@Controller('certificates')
@UseGuards(new AuthGuard('certificates'))
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  read(@Query(new ZodPiPe(getSchema)) query) {
    return this.certificatesService.get(query);
  }

  @Get(':id')
  download(@Param(new ZodPiPe(DownloadSchema)) param) {
    return this.certificatesService.download(param);
  }

  @Post()
  create(@Body(new ZodPiPe(PostCertificateSchema)) body) {
    return this.certificatesService.post(body);
  }

  @Delete(':id')
  delete(@Param(new ZodPiPe(DeleteSchema)) param) {
    return this.certificatesService.delete(param);
  }

  @Get('members')
  getMembers() {
    return this.certificatesService.getMembers();
  }

  @Get('pastors')
  getPastors() {
    return this.certificatesService.getPastors();
  }

  @Get('stats')
  getTotal() {
    return this.certificatesService.getStats();
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(600, 100, true))
  uploadLogo(@UploadedFile() file: File) {
    return this.certificatesService.uploadLogo(file);
  }
}
