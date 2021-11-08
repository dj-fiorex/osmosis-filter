const getCoinPrice = async (coins, vs_currencies = 'usd') => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=${vs_currencies}&include_market_cap=true`
  );
  const data = await response.json();
  console.log(coins, vs_currencies, data);
  return data;
};

export const coingeckoApi = {
  getCoinPrice,
};
