

export class CoordinateSet extends Set {

  constructor() {
    super();
  }

  add(array) {
    if (!Array.isArray(array) || array.length !== 2) {
      throw new TypeError('Input must be an array of length 2');
    }
    if (this.has(array)) {
      // If the array already exists, do nothing and return the set
      return this;
    }
    super.add(array);
    return this;
  }

  has(array) {
    let hasArray = false;
    this.forEach(e => {
      if (e[0]===array[0] && e[1]===array[1]) {
        hasArray = true;;
      }
    });
    return hasArray;
  }
}