import config from '../../config';
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.provider';

@Injectable()
export class StakingRedisService extends RedisService {
  constructor() {
    super({
      host: config.ENV.REDIS_STAKING_HOST,
      port: config.ENV.REDIS_STAKING_PORT,
      password: config.ENV.REDIS_STAKING_PASS,
      family: config.ENV.REDIS_STAKING_FAMILY,
      db: config.ENV.REDIS_STAKING_DB
    })
  }
}
