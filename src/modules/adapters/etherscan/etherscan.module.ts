import { Module } from '@nestjs/common';
import { etherscanService } from './etherscan.service';
import { etherscanController } from './etherscan.controller';

@Module({
  providers: [etherscanService],
  exports: [etherscanService],
  controllers: [etherscanController]
})
export class etherscanModule {}