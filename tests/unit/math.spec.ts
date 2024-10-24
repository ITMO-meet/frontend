import { expect } from 'chai';
import { add, sub, mul, div } from '../../src/math';

describe('Math functions', () => {
    it('should add two numbers correctly', () => {
        const result = add(2, 3);
        expect(result).to.equal(5);
    });

    it('should sub two numbers correctly', () => {
        const result = sub(2, 3);
        expect(result).to.equal(-1);
    });

    it('should mul two numbers correctly', () => {
        const result = mul(2, 3);
        expect(result).to.equal(6);
    });

    it('should div two numbers correctly', () => {
        const result = div(2, 2);
        expect(result).to.equal(1);
    });

    it('should return a number', () => {
        const result = add(2, 3);
        expect(result).to.be.a('number');
    });
});