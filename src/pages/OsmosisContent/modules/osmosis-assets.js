import { coingeckoApi } from './coingecko-api';

const uiCoinNameMapping = {
  OSMO: 'osmosis',
  ION: 'ion',
  'Cosmos Hub - ATOM': 'cosmos',
  'Akash - AKT': 'akash-network',
  'Regen Network - REGEN': 'regen',
  'Sentinel - DVPN': 'sentinel',
  'Persistence - XPRT': 'persistence',
  'IRISnet - IRIS': 'iris-network',
  'Crypto.org - CRO': 'crypto-com-chain',
  'Starname - IOV': 'starname',
  'e-Money - NGM': 'e-money',
  'e-Money - EEUR': 'e-money-eur',
  'Juno - JUNO': 'juno-network',
  //"Microtick - TICK": "osmosis",
  'Likecoin - LIKE': 'likecoin',
  //"IXO - IXO": "osmosis",
  'Terra - LUNA': 'terra-luna',
  'Terra - UST': 'terrausd',
  'BitCanna - BCNA': 'bitcanna',
  'BitSong - BTSG': 'bitsong',
};

const getTableBodyColumn = (data, width = '12.5%') => {
  return _getTableColumn(data, 'css-pq4qi6', width);
};

const getTableHeaderColumn = (data, width = '12.5%') => {
  return _getTableColumn(data, 'css-b58gmc', width);
};

const getTableHeaderColumnSort = (
  data,
  idForSort,
  defaultSordOrder = 'asc',
  width = '12.5%'
) => {
  return `<td class="css-13zb0wo" style="width: ${width}; position: initial; cursor:pointer;"><p id="${idForSort}" class="css-b58gmc">${data} ${
    defaultSordOrder === 'asc' ? '↓' : '↑'
  }</p></td>`;
};

const _getTableColumn = (data, pClass, width = '12.5%') => {
  return `<td class="css-13zb0wo" style="width: ${width}; position: initial;"><p class="${pClass}">${data}</p></td>`;
};

const addPriceColumn = (rows, prices_data, price_vs_currency = 'usd') => {
  rows.forEach((row, i) => {
    const secondColumn = row.querySelector(`td:nth-child(2)`);
    //first row => add header
    if (i === 0) {
      secondColumn.insertAdjacentHTML(
        `afterend`,
        getTableHeaderColumnSort(`Price $`, 'sortByPrice')
      );
      const btn = document.querySelector(`#sortByPrice`);
      btn.addEventListener('click', () => {
        console.log('sortByPrice');
        sortTable(3, (a, b, sortOrder) => {
          if (sortOrder == 'asc') {
            btn.textContent = btn.textContent.replace('↑', '↓');
            return parseFloat(a.textContent) > parseFloat(b.textContent);
          } else {
            btn.textContent = btn.textContent.replace('↓', '↑');
            return parseFloat(a.textContent) < parseFloat(b.textContent);
          }
        });
      });
    } else {
      //get price from coingecko
      let assetName = row.querySelector(`td:nth-child(1)`).innerText;
      console.log('assetName: ', assetName);
      if (
        assetName.includes('Microtick - TICK') ||
        assetName.includes('IXO - IXO')
      ) {
        secondColumn.insertAdjacentHTML(`afterend`, getTableBodyColumn('0'));
      } else {
        const coinName = uiCoinNameMapping[assetName];
        const price = prices_data[coinName][price_vs_currency];
        console.log('price: ', price);
        secondColumn.insertAdjacentHTML(`afterend`, getTableBodyColumn(price));
      }
    }
  });
};

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

const addMarketCapColumn = (rows, prices_data) => {
  const columnWidth = '15%';
  rows.forEach((row, i) => {
    const secondColumn = row.querySelector(`td:nth-child(2)`);
    //first row => add header
    if (i === 0) {
      secondColumn.insertAdjacentHTML(
        `afterend`,
        getTableHeaderColumnSort(`Market Cap $`, 'sortByMc', 'asc', columnWidth)
      );
      const btn = document.querySelector(`#sortByMc`);
      btn.addEventListener('click', () => {
        console.log('sortByMc');
        sortTable(2, (a, b, sortOrder) => {
          if (sortOrder == 'asc') {
            btn.textContent = btn.textContent.replace('↑', '↓');
            return (
              parseInt(a.textContent.replaceAll(',', '')) >
              parseInt(b.textContent.replaceAll(',', ''))
            );
          } else {
            btn.textContent = btn.textContent.replace('↓', '↑');
            return (
              parseInt(a.textContent.replaceAll(',', '')) <
              parseInt(b.textContent.replaceAll(',', ''))
            );
          }
        });
      });
    } else {
      //get price from coingecko
      let assetName = row.querySelector(`td:nth-child(1)`).innerText;
      console.log('assetName: ', assetName);
      if (
        assetName.includes('Microtick - TICK') ||
        assetName.includes('IXO - IXO')
      ) {
        secondColumn.insertAdjacentHTML(
          `afterend`,
          getTableBodyColumn('0', columnWidth)
        );
      } else {
        const coinName = uiCoinNameMapping[assetName];
        let marketCap = numberWithCommas(
          parseInt(prices_data[coinName]['usd_market_cap'])
        );
        // marketCap = marketCap.substring(0, marketCap.lastIndexOf('.'));
        // const reverseMarketCap = marketCap.split('').reverse().join('');
        // marketCap = reverseMarketCap
        //   .replace(/(.{3})/g, '$1.')
        //   .split('')
        //   .reverse()
        //   .join('');
        console.log('marketCap: ', marketCap);
        secondColumn.insertAdjacentHTML(
          `afterend`,
          getTableBodyColumn(marketCap, columnWidth)
        );
      }
    }
  });
};

const fixColumnsSize = (rows) => {
  rows.forEach((row, i) => {
    const secondColumn = row.querySelector(`td:nth-child(2)`);
    secondColumn.style.paddingRight = '0px';
    secondColumn.style.width = '12.5%';
    secondColumn.style.justifyContent = 'unset';
    const firstColumn = row.querySelector(`td:nth-child(1)`);
    firstColumn.style.width = '35%';
  });
};

const start = () => {
  console.log('osmosis-assets.js');
  const osmosisTable = document.querySelector(`table`);
  console.log(osmosisTable);
  const price_vs_currency = 'usd';
  const allRows = osmosisTable.querySelectorAll('tr');
  coingeckoApi
    .getCoinPrice(Object.values(uiCoinNameMapping).join('%2C'))
    .then((data) => {
      console.log('data: ', data);
      //Add new column to every row
      fixColumnsSize(allRows);
      addPriceColumn(allRows, data, price_vs_currency);
      addMarketCapColumn(allRows, data);
    })
    .catch((err) => {
      console.log('err: ', err);
    });
};

export const startAssets = () => {
  setTimeout(() => {
    start();
  }, 10000);
};

const sortTable = (n, sortFunc) => {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.querySelector(`table`);
  switching = true;
  // Set the sorting direction to ascending:
  dir = 'asc';
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.querySelectorAll('.css-1lfky4b');
    console.log('rows: ', rows);
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 0; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName('TD')[n];
      y = rows[i + 1].getElementsByTagName('TD')[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (sortFunc(x, y, dir)) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
      //if (dir == 'asc') {
      //  if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
      // If so, mark as a switch and break the loop:
      //shouldSwitch = true;
      //break;
      //  }
      //} else if (dir == 'desc') {
      //  if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
      // If so, mark as a switch and break the loop:
      //    shouldSwitch = true;
      //    break;
      //  }
      //}
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      console.log(switchcount, dir);
      if (switchcount == 0 && dir == 'asc') {
        dir = 'desc';
        switching = true;
      }
    }
  }
};
