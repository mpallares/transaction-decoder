import { Chain, mainnet, base, arbitrum, polygon } from 'viem/chains';

export type SupportedChain = 'ethereum' | 'base' | 'arbitrum' | 'polygon';

export interface ChainConfig {
  chain: Chain;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: string;
}

const ALCHEMY_API_KEY = '0KH2AJYRvEYdcX2uNXVV0';

export const SUPPORTED_CHAINS: Record<SupportedChain, ChainConfig> = {
  ethereum: {
    chain: mainnet,
    name: 'Ethereum',
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: 'ETH',
  },
  base: {
    chain: base,
    name: 'Base',
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorerUrl: 'https://basescan.org',
    nativeCurrency: 'ETH',
  },
  arbitrum: {
    chain: arbitrum,
    name: 'Arbitrum',
    rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: 'ETH',
  },
  polygon: {
    chain: polygon,
    name: 'Polygon',
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: 'MATIC',
  },
};

export function getChainConfig(chainId: number): ChainConfig | undefined {
  const entry = Object.entries(SUPPORTED_CHAINS).find(
    ([, config]) => config.chain.id === chainId
  );
  return entry?.[1];
}
