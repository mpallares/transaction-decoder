import { ERC20_ABI, ERC721_ABI } from './abis';

export interface ContractABI {
  abi: unknown[];
  name?: string;
}

export function getCommonABI(): ContractABI {
  // Return common ERC20 ABI
  // This will work for most token contracts
  return { abi: [...ERC20_ABI] };
}

export { ERC20_ABI, ERC721_ABI };
