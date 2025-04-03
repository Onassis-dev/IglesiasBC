import { Module } from '@nestjs/common';
import { WebsitesModule } from './routes/websites/websites.module';
import { ChurchesModule } from './routes/churches/churches.module';
import { BuilderModule } from './routes/builder/builder.module';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { UsersModule } from './routes/users/users.module';
import { PaymentsModule } from './routes/payments/payments.module';
import { MembersModule } from './routes/members/members.module';
import { OptionsModule } from './routes/options/options.module';
import { CertificatesModule } from './routes/certificates/certificates.module';
import { PostsModule } from './routes/posts/posts.module';
import { PermissionsModule } from './routes/permissions/permissions.module';
import { InventoryModule } from './routes/inventory/inventory.module';
import { TreasuriesModule } from './routes/treasuries/treasuries.module';
import { TransactionsModule } from './routes/transactions/transactions.module';
import { DashboardModule } from './routes/dashboard/dashboard.module';
import { PresentationsModule } from './routes/presentations/presentations.module';
@Module({
  imports: [
    WebsitesModule,
    ChurchesModule,
    BuilderModule,
    UsersModule,
    PaymentsModule,
    MembersModule,
    OptionsModule,
    InventoryModule,
    PermissionsModule,
    PostsModule,
    FastifyMulterModule,
    TreasuriesModule,
    TransactionsModule,
    DashboardModule,
    CertificatesModule,
    PresentationsModule,
  ],
})
export class AppModule {}
