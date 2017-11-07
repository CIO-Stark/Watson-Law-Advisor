
/**
 * IndexOf for arrays of objects.
 * @param  {array} array - Array to search
 * @param  {string} prop - property filter the value param
 * @param  {any} value - value to look for
 */
export function indexOfObject (array, prop, value) {
  let valueIndex = -1;

  array.some((option, index) => {
    if (option[prop] === value) {
      valueIndex = index;
      return true;
    }

    return false;
  });

  return valueIndex;
}

/**
 * Clone given entity
 * @param  {any} entity - entity to clone
 * @return {any}
 */
export function clone (entity) {
    return JSON.parse(JSON.stringify(entity));
}