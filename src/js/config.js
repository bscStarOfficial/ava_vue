const addresses = {
  "56": {
    staking: '',
    ava: "",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    multiCall: '',
    referral: '',
    rootAddress: '0xEaA5e6c412700F93b232Df91C4Ce5da0C675376C',
  },
  "5611": {
    staking: '0x97fF1cEe18C0A1153254726737e769fB06431cdD',
    ava: "0xB8E5e0169c55E97Ec45e19AeF6a4e4A33F0388e0",
    usdt: "0x9c4D13C44F211c3F21D279Affc578F79f4cB72EC",
    multiCall: '0x25CEe109e73d691fe3e4d1241FD88Bb88F8757a5',
    referral: '0x90fF01A651076C066fF70883fEEaA91Fe6Cc79Ba',
    rootAddress: '0xEaA5e6c412700F93b232Df91C4Ce5da0C675376C',
  },
}

export async function getAddress(name) {
  const chainId = await getChainId();
  return addresses[chainId][name];
}

export async function getChainId() {
  let chainId = await window.ethereum.request({method: 'eth_chainId'});
  return parseInt(chainId, 16).toString()
}


