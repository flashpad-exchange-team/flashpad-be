import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectionsModule } from './connections/connections.module';
import { NftsModule } from './modules/nfts/nfts.module';
import { SchedulesModule } from './modules/schedules/schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConnectionsModule,
    NftsModule,
    SchedulesModule,
  ],
  providers: [ConnectionsModule],
})
export class AppModule {}
