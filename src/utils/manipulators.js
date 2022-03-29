import { get, take, takeRight } from 'lodash-es';

export const removeItemById = (inputItem, inputArray) => {
  if (!inputArray) return [inputItem];
  const matchIndex = inputArray.findIndex(
    element => get(element, 'id') === get(inputItem, 'id'),
  );

  if (matchIndex === -1) return inputArray;
  return [
    ...take(inputArray, matchIndex),
    ...takeRight(inputArray, inputArray.length - matchIndex - 1),
  ];
};

export const mergeItemById = (inputItem, inputArray) => {
  /* Searches array for an element whose id matches the input item's id.
   * If no such element is found, item is added to the end of the array.
   * If an element is found, that element is merged with the input item.
   * Returns a new array. */

  if (!inputArray) return [inputItem];
  const matchIndex = inputArray.findIndex(
    element => get(element, 'id') === get(inputItem, 'id'),
  );

  if (matchIndex === -1) return [...inputArray, inputItem];

  return [
    ...take(inputArray, matchIndex),
    { ...inputArray[matchIndex], ...inputItem },
    ...takeRight(inputArray, inputArray.length - matchIndex - 1),
  ];
};
