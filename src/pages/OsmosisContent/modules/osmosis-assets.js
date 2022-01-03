import { OsmosisApi } from './osmosis-api';

const getTableBodyColumn = (data, width = '15%') => {
  return _getTableColumn(data, 'css-pq4qi6', width);
};

const getTableHeaderColumnSort = (
  data,
  idForSort,
  defaultSordOrder = 'asc',
  width = '15%'
) => {
  return `<td class="css-13zb0wo" style="width: ${width}; position: initial; cursor:pointer;"><p id="${idForSort}" class="css-b58gmc">${data} ${
    defaultSordOrder === 'asc' ? '↓' : '↑'
  }</p></td>`;
};

const _getTableColumn = (data, pClass, width = '15%') => {
  return `<td class="css-13zb0wo" style="width: ${width}; position: initial;"><p class="${pClass}">${data}</p></td>`;
};

const addPriceColumn = (rows, prices_data) => {
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
        sortTable(3, (a, b, sortOrder) => {
          if (sortOrder == 'asc') {
            btn.textContent = btn.textContent.replace('↑', '↓');
            return (
              parseFloat(a.textContent.replace(',', '')) >
              parseFloat(b.textContent.replace(',', ''))
            );
          } else {
            btn.textContent = btn.textContent.replace('↓', '↑');
            return (
              parseFloat(a.textContent.replace(',', '')) <
              parseFloat(b.textContent.replace(',', ''))
            );
          }
        });
      });
    } else {
      //get price from osmosis api
      try {
        let assetName = row.querySelector(`td:nth-child(1)`).innerText;
        if (assetName === 'OSMO' || assetName === 'ION') {
        } else {
          assetName = assetName.substr(assetName.indexOf(' - ') + 3);
        }
        let price = prices_data.filter((x) => x.symbol === assetName)[0].price;
        price = price.toLocaleString('en'); //.toFixed(5);
        secondColumn.insertAdjacentHTML(`afterend`, getTableBodyColumn(price));
      } catch (error) {
        console.log('error: ', error);
      }
    }
  });
};

const addMarketCapColumn = (rows, prices_data) => {
  const columnWidth = '15%';
  rows.forEach((row, i) => {
    const secondColumn = row.querySelector(`td:nth-child(2)`);
    //first row => add header
    if (i === 0) {
      secondColumn.insertAdjacentHTML(
        `afterend`,
        getTableHeaderColumnSort(`Liquidity $`, 'sortByMc', 'asc', columnWidth)
      );
      const btn = document.querySelector(`#sortByMc`);
      btn.addEventListener('click', () => {
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
      let marketCap = 0;
      let assetName = row.querySelector(`td:nth-child(1)`).innerText;
      try {
        if (assetName === 'OSMO' || assetName === 'ION') {
        } else {
          assetName = assetName.substr(assetName.indexOf(' - ') + 3);
        }
        marketCap = prices_data.filter((x) => x.symbol === assetName)[0]
          .liquidity;
        marketCap = marketCap.toLocaleString('en'); //.toFixed(2);
        secondColumn.insertAdjacentHTML(
          `afterend`,
          getTableBodyColumn(marketCap, columnWidth)
        );
      } catch (error) {
        console.log('error: ', error);
      }
    }
  });
};

const fixColumnsSize = (rows) => {
  rows.forEach((row, i) => {
    const secondColumn = row.querySelector(`td:nth-child(2)`);
    secondColumn.style.paddingRight = '0px';
    secondColumn.style.width = '15%';
    secondColumn.style.justifyContent = 'unset';
    const firstColumn = row.querySelector(`td:nth-child(1)`);
    firstColumn.style.width = '35%';
  });
  document.querySelectorAll('.css-13zb0wo').forEach((x) => {
    x.style.paddingRight = '0px';
    x.style.width = '35%';
  });
};

const start = () => {
  console.log('osmosis-assets.js');
  const osmosisTable = document.querySelector(`table`);
  const allRows = osmosisTable.querySelectorAll('tr');
  OsmosisApi.getCoinsInfo()
    .then((data) => {
      fixColumnsSize(allRows);
      addPriceColumn(allRows, data);
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
      if (switchcount == 0 && dir == 'asc') {
        dir = 'desc';
        switching = true;
      }
    }
  }
};
