import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StakingRedisService } from './redis/staking.redis.provider';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [StakingRedisService],
  exports: [StakingRedisService, EventEmitterModule],
})
export class ConnectionsModule {}
