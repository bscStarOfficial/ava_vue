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
    staking: '0x5A378Af42B1b8E01833FF43364198698AFf22033',
    ava: "0x5Fd6D5568B03346cb20f3e1b8ef01B9c6EB32054",
    usdt: "0x9c4D13C44F211c3F21D279Affc578F79f4cB72EC",
    multiCall: '0x25CEe109e73d691fe3e4d1241FD88Bb88F8757a5',
    referral: '0xB77D52fD193C5b61C43616Fc7842673eE4b1fB95',
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


