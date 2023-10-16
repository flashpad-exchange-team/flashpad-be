import { NftsModule } from './../nfts/nfts.module';
import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { CrawlsSchedule } from './crawls.schedule';

@Module({
  imports: [
    ConnectionsModule,
    ReposityModule,
    NftsModule
  ],
  controllers: [],
  providers: [CrawlsSchedule],
})
export class SchedulesModule {}
