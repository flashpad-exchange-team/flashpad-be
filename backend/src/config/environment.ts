export const Environment = {
  SERVER_PORT: Number(process.env.SERVER_PORT || 3000),
  SOCKET_PORT: Number(process.env.SOCKET_PORT || 3001),
  SERVER_HOST: process.env.SERVER_HOST || 'http://localhost',

  // Redis Web socket client config
  REDIS_STAKING_HOST: process.env.REDIS_STAKING_HOST || 'localhost',
  REDIS_STAKING_PORT: Number(process.env.REDIS_STAKING_PORT || 6379),
  REDIS_STAKING_PASS: process.env.REDIS_STAKING_PASS,
  REDIS_STAKING_FAMILY: Number(process.env.REDIS_STAKING_FAMILY || 4),
  REDIS_STAKING_DB: Number(process.env.REDIS_STAKING_DB || 0),

  // Web3 host
  NETWORK_RPC_URL:
    process.env.NETWORK_RPC_URL || 'https://rpc-kura.cross.technology/',
  PERMITTED_NFTS_ADDRESS:
    process.env.PERMITTED_NFTS_ADDRESS ||
    '0xD17Beddb48e6D29A8798845FCCa341566669db13',
  WXCR_ADDRESS:
    process.env.WXCR_ADDRESS || '0x3b3f35c81488c49b370079fd05cfa917c83a38a9',
  COLLECTION_ADDRESS:
    process.env.COLLECTION_ADDRESS ||
    '0x25baf69a46923c0db775950b0ef96e6018343a36',
  LENDING_POOL_ADDRESS:
    process.env.LENDING_POOL_ADDRESS ||
    '0xa01d399346e76bd863f726366c31789b2fc43ad9',
  LOAN_ADDRESS:
    process.env.LOAN_ADDRESS || '0x1f2cd935b0ca5b7e9ee2f98970d1bb78797ba6d8',
  CHAIN_ID: process.env.CHAIN_ID || '5555',
  MARKETPLACE_ADDRESS:
    process.env.MARKETPLACE_ADDRESS ||
    '0x0a0736fcB4978f6334c35ca95b002755577E1115',
};
