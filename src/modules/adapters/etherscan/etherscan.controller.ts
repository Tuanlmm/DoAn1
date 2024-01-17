import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { etherscanService } from './etherscan.service';

@Controller('etherscan')
export class etherscanController {
  constructor(private readonly etherscanService: etherscanService) {}

  @Get('checkContract/:tokenAddress')
  async checkContract(@Param('tokenAddress') tokenAddress: string) {
    try {
      const supportedChain = await this.etherscanService.isContractValidOnChain(
        tokenAddress
      );
      if (!supportedChain) {
        throw new NotFoundException('Unsupported Chain');
      }
      return {
        isSupported: true,
        chain: supportedChain,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}