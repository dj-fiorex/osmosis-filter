import { poolCardClass, contentDivClass } from './osmosis-def';
import {
  populatePool,
  checkType,
  getPoolId,
  getPoolName,
  createEmptyPool,
} from './osmosis-utility';

export const processOsmosis = (baseElement) => {
  const allPools = [];
  baseElement.querySelectorAll(`.${contentDivClass}`).forEach((element) => {
    const elementType = checkType(element);

    element.querySelectorAll(`.${poolCardClass}`).forEach((element) => {
      const poolId = getPoolId(element);
      let exists = allPools.find((pool) => {
        return pool.id == poolId;
      });
      if (!exists) {
        exists = {
          id: poolId,
          name: getPoolName(element),
          cardElement: element,
          ...createEmptyPool(),
        };
        allPools.push(exists);
      }
      populatePool(exists, element, elementType);
    });
  });
  console.log(allPools);
  return allPools;
};

export const orderPoolsBy = (sortBy, pools, sortOrder = 'desc') => {
  const sortOrderNum = sortOrder.toLowerCase().includes('desc') ? -1 : 1;
  const sortByFunc = (a, b) => {
    let toReturn = 0;
    if (a[sortBy] < b[sortBy]) {
      toReturn = -1 * sortOrderNum;
    } else if (a[sortBy] > b[sortBy]) {
      toReturn = 1 * sortOrderNum;
    } else toReturn = 0;
    return toReturn;
  };
  return pools.sort(sortByFunc);
};
