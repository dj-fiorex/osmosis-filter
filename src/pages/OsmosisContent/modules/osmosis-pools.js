import { poolCardClass, contentDivClass } from './osmosis-pools-def';
import {
  populatePool,
  checkType,
  getPoolId,
  getPoolName,
  createEmptyPool,
} from './osmosis-pools-utility';
import { section } from './osmosis-pools-section';
import {
  dollarIcon,
  starIcon,
  exclamationMarkIcon,
  iconWithTooltip,
  divFlexContentBetween,
  multiselect,
} from './components';

import { containerAllClass, mainContainerClass } from './osmosis-pools-def';

let firstPaint = true;
let activated = false;
let allPools = [];
let backupString = '';
let currentSorting = 'apr';

const processOsmosis = (baseElement) => {
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

const orderPoolsBy = (sortBy, pools, sortOrder = 'desc') => {
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

const doBackup = () => {
  //Do backup first
  backupString = document.querySelector(`.${containerAllClass}`).innerHTML;
};

const setupUI = () => {
  const osmosisBtn = (text) =>
    `<button id="toggleBtn" style="margin-left: auto" class="css-17pbjmo">${text}</button>`;

  const mainContainer = document.querySelector(`.${mainContainerClass}`);

  mainContainer.insertAdjacentHTML('beforeend', osmosisBtn('Activate'));

  const btnEl = document.querySelector('#toggleBtn');

  btnEl.addEventListener('click', () => {
    if (!activated) {
      activated = true;
      btnEl.innerText = 'Deactivate';
      doProcess();
    } else {
      activated = false;
      btnEl.innerText = 'Activate';
      document.querySelector(`.${containerAllClass}`).innerHTML = backupString;
      firstPaint = true;
      setupUI();
    }
  });
};

const doPreprocess = () => {
  allPools = processOsmosis(document);
};

const doProcess = () => {
  //Inserisco il mio container
  const osmosisFirstContainer = document.querySelector(`.css-6p69f`);
  osmosisFirstContainer.insertAdjacentHTML('afterend', section(multiselect()));

  const poolContainer = document.querySelector(`#orderedPoolsUl`);
  const filterSelect = document.querySelector(`#filter-select`);

  const filterSelectHandler = (e) => {
    e.preventDefault();

    const selected = e.target.value;
    console.log(selected);
    if (selected === currentSorting) return;
    currentSorting = selected;
    let orderedPools = [];

    orderedPools = orderPoolsBy(selected, allPools);

    poolContainer.innerHTML = '';
    orderedPools.forEach((pool) => {
      addToContainer(poolContainer, pool, false);
    });
  };

  filterSelect.addEventListener('change', filterSelectHandler);

  const orderedPools = orderPoolsBy('apr', allPools);

  orderedPools.forEach((pool) => {
    addToContainer(poolContainer, pool, firstPaint);
  });
  firstPaint = false;
};

const addToContainer = (container, element, firstPaint) => {
  if (firstPaint) {
    let toAdd = '';
    if (element.isMine) {
      toAdd += iconWithTooltip(dollarIcon, 'You have money in this pool!');
    }
    if (element.isIncentivized) {
      toAdd += iconWithTooltip(starIcon, 'Pool is incentivized');
    }
    if (element.isExternalIncentivized) {
      toAdd += iconWithTooltip(
        exclamationMarkIcon,
        'Pool is external incentivized'
      );
    }

    if (element.isExternalIncentivized && element.isIncentivized) {
      element.cardElement.insertAdjacentHTML(
        'beforeend',
        element.bonusElement.outerHTML
      );
    }

    if (toAdd !== '') {
      element.cardElement.insertAdjacentHTML(
        'afterbegin',
        divFlexContentBetween(toAdd)
      );
    }
  }
  container.appendChild(element.cardElement);
};

export const startPools = () => {
  setTimeout(() => {
    doPreprocess();
    doBackup();
    setupUI();
  }, 10000);
};
