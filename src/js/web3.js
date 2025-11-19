import Web3 from 'web3';
import {verifyTypedData} from "ethers";

export function getWeb3() {
  let code = window.ethereum ? 1 : (window.web3 ? 2 : 0)
  switch (code) {
    case 1:
      return windowEthereum();
    case 2:
      return windowWeb3();
    default:
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return {web3: null, ethereum: null};
  }
}

async function windowEthereum() {
  const {ethereum} = window;
  window.web3 = new Web3(ethereum);
  try {
    // Request account access if needed
    // let time = parseInt(localStorage.getItem("lastAccountRequest"));
    // if(nowTimestamp() - time > 30) {
    await ethereum.request({method: 'eth_requestAccounts'});
    //   localStorage.setItem("lastAccountRequest", nowTimestamp().toString());
    // }
    return {web3: window.web3, ethereum};
  } catch (error) {
    return {web3: null, ethereum: null}
  }
}

export function getSelectedAddress() {
  // return '0x2F30ccd8C9b026f08B646996D3dA856D0dAA5851';
  return window.ethereum?.selectedAddress;
}

export function newBN(str) {
  return Web3.utils.toBN(str)
}

export function newBN18(str) {
  return Web3.utils.toBN(str).mul(newBN("1000000000000000000"))
}

async function windowWeb3() {
  window.web3 = new Web3(web3.currentProvider);
  return {web3: window.web3, ethereum: null};
}

export async function getContract(abi, address) {
  const web3 = window.web3;
  return new web3.eth.Contract(abi, address);
}

export async function sign() {
  let chainId = await window.ethereum.request({method: 'eth_chainId'});
  const domain = {
    name: 'AVA Token',
    version: '1',
    chainId: chainId,
  };
  const message = {
    time: new Date().getTime(),
  };
  localStorage.setItem('signMessage', JSON.stringify(message));

  const primaryType = 'Message';
  const types = {
    EIP712Domain: [
      {name: 'name', type: 'string'},
      {name: 'version', type: 'string'},
      {name: 'chainId', type: 'uint256'},
    ],
    Message: [
      {name: "time", type: "uint256"},
    ],
  };

  const sign = await ethereum.request({
    method: "eth_signTypedData_v4",
    params: [
      getSelectedAddress(),
      {
        domain, primaryType, types, message
      }
    ],
  });
  localStorage.setItem('signResult', sign);
}

export async function recover() {
  let signMessage = localStorage.getItem('signMessage') || '';
  let signResult = localStorage.getItem('signResult') || '';

  if (!signMessage || !signResult) {
    await sign();
    return;
  }

  let chainId = await window.ethereum.request({method: 'eth_chainId'});
  const domain = {
    name: 'AVA Token',
    version: '1',
    chainId: chainId,
  };
  const message = JSON.parse(signMessage);
  const types = {
    EIP712Domain: [
      {name: 'name', type: 'string'},
      {name: 'version', type: 'string'},
      {name: 'chainId', type: 'uint256'},
    ],
    Message: [
      {name: "time", type: "uint256"},
    ],
  };

  const recoveredAddress = verifyTypedData(
    domain,
    {Message: types.Message},
    message,
    signResult
  );

  if (recoveredAddress.toLowerCase() !== getSelectedAddress().toLowerCase()) {
    await sign()
  }
}

export async function getGasPrice() {
  return await web3.eth.getGasPrice();
}

export async function getSendPram() {
  return {
    from: getSelectedAddress(),
    gasPrice: await getGasPrice(),
  }
}
