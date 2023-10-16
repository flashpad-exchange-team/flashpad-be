import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NftsService } from './nfts.service';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Get()
  findAll(@Query() conditions: Record<string, string>) {
    return this.nftsService.findAll(conditions);
  }
}
