import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [CertificatesController],
  providers: [CertificatesService, ContextProvider],
})
export class CertificatesModule {}
