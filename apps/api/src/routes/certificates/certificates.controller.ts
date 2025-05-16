import {
  Controller,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';
import { ImageHandler } from 'src/interceptors/files/image.interceptor';
import { certificatesContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
@Controller()
@UseGuards(new AuthGuard('certificates'))
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @TsRestHandler(certificatesContract.get)
  read() {
    return tsRestHandler(certificatesContract.get, ({ query }) =>
      this.certificatesService.get(query),
    );
  }

  @TsRestHandler(certificatesContract.create)
  create() {
    return tsRestHandler(certificatesContract.create, ({ body }) =>
      this.certificatesService.post(body),
    );
  }

  @TsRestHandler(certificatesContract.delete)
  delete() {
    return tsRestHandler(certificatesContract.delete, ({ params }) =>
      this.certificatesService.delete(params),
    );
  }

  @TsRestHandler(certificatesContract.getMembers)
  getMembers() {
    return tsRestHandler(certificatesContract.getMembers, () =>
      this.certificatesService.getMembers(),
    );
  }

  @TsRestHandler(certificatesContract.getPastors)
  getPastors() {
    return tsRestHandler(certificatesContract.getPastors, () =>
      this.certificatesService.getPastors(),
    );
  }

  @TsRestHandler(certificatesContract.getStats)
  getStats() {
    return tsRestHandler(certificatesContract.getStats, () =>
      this.certificatesService.getStats(),
    );
  }
  @TsRestHandler(certificatesContract.uploadLogo)
  @UseInterceptors(FileInterceptor('file'), new ImageHandler(600, 100, true))
  uploadLogo(@UploadedFile() file: File) {
    return tsRestHandler(certificatesContract.uploadLogo, () =>
      this.certificatesService.uploadLogo(file),
    );
  }
}
