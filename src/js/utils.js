import BigNumber from "bignumber.js";

export function toAmountK(amount) {
  let am = new BigNumber(amount);
  if (am.gte("1000")) {
    return am.div("1000").toFixed(3) + "k"
  } else {
    return am.toFixed(3);
  }
}

export function toAmountK0(amount) {
  let am = new BigNumber(amount);
  if (am.gte("1000")) {
    return am.div("1000").toFixed(0) + "k"
  } else {
    return am.toFixed(0);
  }
}

export function toFixed(amount, n) {
  return new BigNumber(amount).toFixed(n);
}

export function div18(amount, number = 1e18) {
  return new BigNumber(amount).dividedBy(number).toFixed(0);
}

export function replaceMiddleWithAsterisks(inputString) {
  if (inputString == "") return ""
  const firstFiveCharacters = inputString.substring(0, 6);
  const lastFiveCharacters = inputString.substring(inputString.length - 5);
  return firstFiveCharacters + "****" + lastFiveCharacters
}

export function replaceMiddleWithAsterisks2(inputString) {
  if (inputString == "") return ""
  const firstFiveCharacters = inputString.substring(0, 10);
  const lastFiveCharacters = inputString.substring(inputString.length - 9);
  return firstFiveCharacters + "****" + lastFiveCharacters
}

export function replaceMiddleWithAsterisks3(inputString) {
  if (inputString == "") return ""
  const firstFiveCharacters = inputString.substring(0, 7);
  return firstFiveCharacters + "****"
}
