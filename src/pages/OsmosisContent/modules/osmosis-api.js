const getCoinsInfo = async () => {
  const response = await fetch(
    'https://api-osmosis.imperator.co/tokens/v1/all'
  );
  const data = await response.json();
  console.log(data);
  return data;
};

export const OsmosisApi = {
  getCoinsInfo,
};
