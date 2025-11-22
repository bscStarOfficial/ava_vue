const addresses = {
  "56": {
    ava: "0x390360253FDC02B6E1AbE8c9EFA5562F4402408F",
    staking: '0x2e4E0B102a5d21D8F8eC24C811762C81444f877b',
    referral: '0xcB7A7528e06A0745d96c9f8C2Dc631C5fDA8BA5e',
    usdt: "0xF7c36DdfC878798C0edF726aDB2Fc9795190A270",
    multiCall: '0xeB270359Faa618378ad325691F894b52CA50b520',
    rootAddress: '0x798967E40fD9fBDDc3F9b985A2EB14c9fDAe1c1F',
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


