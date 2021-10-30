import {
  poolNameClass,
  poolAprClass,
  subheaderClass,
  cardHeadClass,
  titleClass,
} from './osmosis-def';

export const getPoolName = (element) => {
  try {
    return element.querySelector(`.${poolNameClass}`).textContent;
  } catch (error) {
    console.error('[getPoolName]: ', error);
    return '';
  }
};
export const getPoolApr = (element, type) => {
  try {
    const all = Array.from(element.querySelectorAll(`.${poolAprClass}`));
    let str = '';
    if (type === 'My Pools') {
      str = all[1].textContent;
    } else if (type === 'Incentivized Pools') {
      str = all[0].textContent;
    }
    const nmb = parseFloat(str.replace('%', '').replaceAll(',', ''));
    return isNaN(nmb) ? 0 : nmb;
  } catch (error) {
    console.error('[getPoolApr]: ', error);
    return 0;
  }
};

export const getPoolLiquidity = (element, type) => {
  try {
    const all = Array.from(element.querySelectorAll(`.${poolAprClass}`));
    let str = '';
    if (type === 'My Pools') {
      str = all[0].textContent;
    } else if (type === 'Incentivized Pools') {
      str = all[1].textContent;
    }
    const nmb = parseFloat(str.replace('$', '').replaceAll(',', ''));
    return isNaN(nmb) ? 0 : nmb;
  } catch (error) {
    console.error('[getPoolLiquidity]: ', error);
    return 0;
  }
};

export const getPoolBonusRemaining = (element) => {
  try {
    const str = Array.from(element.querySelectorAll(`.${poolAprClass}`))[0]
      .textContent;
    const nmb = parseFloat(
      str.substring(0, str.indexOf(' ')).replaceAll(',', '')
    );
    return isNaN(nmb) ? 0 : nmb;
  } catch (error) {
    console.error('[getPoolBonusRemaining]: ', error);
    return 0;
  }
};
export const getPoolBonusRemainingCoin = (element) => {
  try {
    const str = Array.from(element.querySelectorAll(`.${poolAprClass}`))[0]
      .textContent;
    return str.substr(str.indexOf(' ') + 1);
  } catch (error) {
    console.error('[getPoolBonusRemainingCoin]: ', error);
    return '';
  }
};

export const getPoolBonusElement = (element) => {
  try {
    return element.querySelector(`.${subheaderClass}`);
  } catch (error) {
    console.error('[getPoolBonusElement]: ', error);
    return '';
  }
};

export const getPoolEpochsRemaining = (element) => {
  try {
    return Array.from(element.querySelectorAll(`.${poolAprClass}`))[1]
      .textContent;
  } catch (error) {
    console.error('[getPoolEpochsRemaining]: ', error);
    return '';
  }
};

export const getPoolMyLiquidity = (element) => {
  try {
    return Array.from(element.querySelectorAll(`.${poolAprClass}`))[2]
      .textContent;
  } catch (error) {
    console.error('[getPoolMyLiquidity]: ', error);
    return '';
  }
};

export const getPoolMyBondedAmount = (element) => {
  try {
    return Array.from(element.querySelectorAll(`.${poolAprClass}`))[3]
      .textContent;
  } catch (error) {
    console.error('[getPoolMyBondedAmount]: ', error);
    return '';
  }
};

export const getPoolId = (element) => {
  try {
    const str = element
      .querySelector(`.${cardHeadClass}`)
      .querySelector(`h5`).textContent;

    const nmb = parseInt(str.replace('Pool #', ''));
    return isNaN(nmb) ? 0 : nmb;
  } catch (error) {
    console.error('[getPoolId]: ', error);
    return '';
  }
};

export const checkType = (element) => {
  try {
    const title = element.querySelector(`.${titleClass}`);
    return title ? title.textContent : '';
  } catch (error) {
    console.error('[checkType]: ', error);
    return '';
  }
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
