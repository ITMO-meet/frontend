import { expect } from 'chai';
import { add } from '../../src/math';

describe('Math functions', () => {
    it('should add two numbers correctly', () => {
        const result = add(2, 3);
        expect(result).to.equal(5);
    });

    it('should return a number', () => {
        const result = add(2, 3);
        expect(result).to.be.a('number');
    });
});