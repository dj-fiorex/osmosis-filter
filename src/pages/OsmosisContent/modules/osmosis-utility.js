import {
  poolNameClass,
  poolAprClass,
  subheaderClass,
  cardHeadClass,
  titleClass,
} from './osmosis-def';

export const getPoolName = (element) => {
  return element.querySelector(`.${poolNameClass}`).textContent;
};
export const getPoolApr = (element, type) => {
  const all = Array.from(element.querySelectorAll(`.${poolAprClass}`));
  let str = '';
  if (type === 'My Pools') {
    str = all[1].textContent;
  } else if (type === 'Incentivized Pools') {
    str = all[0].textContent;
  }
  const nmb = parseFloat(str.replace('%', '').replaceAll(',', ''));
  return isNaN(nmb) ? 0 : nmb;
};

export const getPoolLiquidity = (element, type) => {
  const all = Array.from(element.querySelectorAll(`.${poolAprClass}`));
  let str = '';
  if (type === 'My Pools') {
    str = all[0].textContent;
  } else if (type === 'Incentivized Pools') {
    str = all[1].textContent;
  }
  const nmb = parseFloat(str.replace('$', '').replaceAll(',', ''));
  return isNaN(nmb) ? 0 : nmb;
};

export const getPoolBonusRemaining = (element) => {
  const str = Array.from(element.querySelectorAll(`.${poolAprClass}`))[0]
    .textContent;
  const nmb = parseFloat(
    str.substring(0, str.indexOf(' ')).replaceAll(',', '')
  );
  return isNaN(nmb) ? 0 : nmb;
};
export const getPoolBonusRemainingCoin = (element) => {
  const str = Array.from(element.querySelectorAll(`.${poolAprClass}`))[0]
    .textContent;
  return str.substr(str.indexOf(' ') + 1);
};

export const getPoolBonusElement = (element) => {
  return element.querySelector(`.${subheaderClass}`);
};

export const getPoolEpochsRemaining = (element) => {
  return Array.from(element.querySelectorAll(`.${poolAprClass}`))[1]
    .textContent;
};

export const getPoolMyLiquidity = (element) => {
  return Array.from(element.querySelectorAll(`.${poolAprClass}`))[2]
    .textContent;
};

export const getPoolMyBondedAmount = (element) => {
  return Array.from(element.querySelectorAll(`.${poolAprClass}`))[3]
    .textContent;
};

export const getPoolId = (element) => {
  const str = element
    .querySelector(`.${cardHeadClass}`)
    .querySelector(`h5`).textContent;

  const nmb = parseInt(str.replace('Pool #', ''));
  return isNaN(nmb) ? 0 : nmb;
};

export const checkType = (element) => {
  const title = element.querySelector(`.${titleClass}`);
  return title ? title.textContent : '';
};

export const createEmptyPool = () => {
  return {
    apr: 0,
    liquidity: 0,
    //IsMine
    isMine: false,
    myLiquidity: 0,
    myBondedAmount: 0,
    //Incentivized
    isIncentivized: false,
    //External
    isExternalIncentivized: false,
    bonusRemaining: 0,
    bonusRemainingCoin: '',
    epochsRemaining: 0,
    bonusElement: '',
  };
};

export const populatePool = (pool, element, elementType) => {
  if (elementType === 'My Pools') {
    pool.isMine = true;
    pool.myLiquidity = getPoolMyLiquidity(element);
    pool.myBondedAmount = getPoolMyBondedAmount(element);
    pool.liquidity = getPoolLiquidity(element, elementType);
    pool.apr = getPoolApr(element, elementType);
  } else if (elementType === 'Incentivized Pools') {
    pool.isIncentivized = true;
    pool.liquidity = getPoolLiquidity(element, elementType);
    pool.apr = getPoolApr(element, elementType);
  } else if (elementType === 'External Incentive Pools') {
    pool.isExternalIncentivized = true;
    pool.bonusRemaining = getPoolBonusRemaining(element);
    pool.bonusRemainingCoin = getPoolBonusRemainingCoin(element);
    pool.epochsRemaining = getPoolEpochsRemaining(element);
    pool.bonusElement = getPoolBonusElement(element);
  }
};
