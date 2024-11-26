class Ship {
  constructor(length) {
      this.length = length;
      this.hits = Array(length).fill(false);  // Keep track of hits on the ship
  }

  hit() {
      // Mark the ship as hit at the first available spot
      for (let i = 0; i < this.length; i++) {
          if (!this.hits[i]) {
              this.hits[i] = true;
              break;
          }
      }
  }

  isSunk() {
      // Check if all parts of the ship are hit
      return this.hits.every(hit => hit);
  }
}

export default Ship;
