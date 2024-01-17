import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { ethers } from 'ethers';

@Injectable()
export class etherscanService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    console.log('etherscanService');
  }

  async isContractValidOnChain(tokenAddress: string): Promise<{ isSucceed: boolean; msg: string; data: { chain: string | null } }> {
    const chains = [
      { name: 'Ethereum', apiUrl: 'https://api.etherscan.io/api' },
      { name: 'BSC', apiUrl: 'https://api.bscscan.com/api' },
      { name: 'Polygon', apiUrl: 'https://api.polygonscan.com/api' },
      { name: 'Arbitrum', apiUrl: 'https://api.arbiscan.io/api' }
    ];
  
    const isValid = ethers.utils.isAddress(tokenAddress);
  
    if (!isValid) {
      return {
        isSucceed: false,
        msg: 'Invalid address',
        data: {
          chain: null
        }
      };
    }
  
    for (const chain of chains) {
      try {
        const response = await fetch(
          `${chain.apiUrl}?module=proxy&action=eth_getCode&address=${tokenAddress}`
        );
        const responseData = await response.json();
  
        if (responseData.result !== '0x') {
          return {
            isSucceed: true,
            msg: 'Success',
            data: {
              chain: chain.name
            }
          };
        }
      } catch (error) {
        return {
          isSucceed: false,
          msg: error.message,
          data: null
        }
      }
    }
  
    return {
      isSucceed: false,
      msg: 'Contract not found on any supported chain',
      data: {
        chain: null
      }
    };
  }  
}