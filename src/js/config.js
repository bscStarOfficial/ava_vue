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
    staking: '0x4057eB6A9416d782F01091F44942c0799c34C782',
    ava: "0x4cCe34D18C4cF21987b469e823C87900a81366b8",
    usdt: "0x9c4D13C44F211c3F21D279Affc578F79f4cB72EC",
    multiCall: '0x25CEe109e73d691fe3e4d1241FD88Bb88F8757a5',
    referral: '0xDB832Dff615657803dC05AA00DbBFF90a6Bf3249',
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


