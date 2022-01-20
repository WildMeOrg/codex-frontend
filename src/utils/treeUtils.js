import { cloneDeep } from 'lodash-es';

export const flattenTree = regions => {
  const flatTree = cloneDeep(regions);
  function addLevel(leaves) {
    leaves.forEach(leaf => {
      if (!flatTree.map(entry => entry?.id).includes(leaf?.id)) {
        flatTree.push(leaf);
      }
      if (leaf?.locationID) addLevel(leaf.locationID);
    });
  }

  addLevel(regions);
  return flatTree;
};
