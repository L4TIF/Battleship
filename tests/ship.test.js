import Ship from "../src/ship";

describe('ship', () => {

    describe('hit', () => {

        let ship;

        beforeEach(() => {
            ship = new Ship(5); //initializing a ship
        });


        test('should increase hit', () => { //testing weather the ship hit func works
            ship.hit();
            expect(ship.hits).toBe(1)
        });

        test('hit should not be greater than ship lenght', () => { //testing if the hits surpasses ship length
            for (let index = 0; index < 10; index++) {
                ship.hit();
            }
            expect(ship.hits).toBe(5);
            expect(ship.hits).toBeLessThanOrEqual(ship.shipLength)
        })

    });

    describe('is Sunk', () => {

        let ship;

        beforeEach(() => {
            ship = new Ship(2);
        });

        test('should be true', () => { //if it hits are equal to the size of the ship
            for (let i = 0; i < 2; i++) {
                ship.hit();
            }
            expect(ship.isSunk()).toBeTruthy()
        });

        test('should be false', () => { // if hit is smaller than length
            ship.hit();
            expect(ship.isSunk()).toBeFalsy();
        });
    })


})