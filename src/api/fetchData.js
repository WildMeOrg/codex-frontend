const url =
  'https://sageoutdooradventures.com/wp-json/maps-api/locations';

const sources = {};

const textFields = {};

export const fetchData = async () => {
  const resp = await fetch(url);
  const json = await resp.json();

  const fixed = Object.entries(json).reduce((acc, [k, v]) => {
    const { type, subtype } = v;
    return {
      ...acc,
      [k]: {
        ...v,
        source: sources[type],
        textField: textFields[subtype],
      },
    };
  }, {});
  return fixed;
};
