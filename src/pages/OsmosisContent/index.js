import { processOsmosis, orderPoolsBy } from './modules/osmosis';
import { section } from './modules/osmosis-section';
import {
  dollarIcon,
  starIcon,
  exclamationMarkIcon,
  iconWithTooltip,
  divFlexContentBetween,
  multiselect,
} from './modules/components';
import { msgHandler } from './modules/utility';
const mainContainerClass = 'css-13n09ay';
const containerAllClass = 'css-1jtuq10';

let firstPaint = true;
let activated = false;
let allPools = [];
let backupString = '';
let currentSorting = 'apr';

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

setTimeout(() => {
  doPreprocess();
  doBackup();
  setupUI();
}, 10000);

chrome.runtime.onMessage.addListener(msgHandler);
