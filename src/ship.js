class Ship {
    #hit = 0;
    constructor(shipLength) {
        this.shipLength = shipLength;
    }

   get hits() { //get total hits
        return this.#hit
    }

    hit() { //increases hit count
        if (this.#hit < this.shipLength)
            this.#hit += 1;
    }

    isSunk() {
        if (this.#hit === this.shipLength)
            return true;
        return false;
    }
}

export default Ship;