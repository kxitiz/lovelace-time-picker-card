import { Second } from '../../src/models/second';
import { Direction } from '../../src/types';
import { expect } from 'chai';

describe('Second', () => {
  let second: Second;

  context('with default config', () => {
    beforeEach(() => {
      second = new Second(2);
    });

    it('returns value', () => {
      expect(second.value).to.equal(2);
    });

    it('has correct max value', () => {
      expect(second.maxValue).to.equal(59);
    });

    describe('toString', () => {
      it('renders values correctly', () => {
        second = new Second(0);
        expect(second.toString()).to.equal('00');

        second = new Second(5);
        expect(second.toString()).to.equal('05');

        second = new Second(59);
        expect(second.toString()).to.equal('59');
      });
    });

    describe('stepUpdate', () => {
      it('updates up', () => {
        second.stepUpdate(Direction.UP);
        expect(second.value).to.equal(7);
      });

      it('updates down', () => {
        second.stepUpdate(Direction.DOWN);
        expect(second.value).to.equal(57);
      });

      it('goes up from 59 to 4', () => {
        second = new Second(59);
        second.stepUpdate(Direction.UP);
        expect(second.value).to.equal(4);
      });

      it('goes down from 0 to 55', () => {
        second = new Second(0);
        second.stepUpdate(Direction.DOWN);
        expect(second.value).to.equal(55);
      });
    });

    describe('setStringValue', () => {
      it('sets value from valid string', () => {
        second.setStringValue('3');
        expect(second.value).to.equal(3);
      });

      it("doesn't set value from invalid string", () => {
        second.setStringValue('test');
        expect(second.value).to.equal(2);
      });

      it("doesn't set value from outside of scope", () => {
        second.setStringValue('60');
        expect(second.value).to.equal(2);

        second.setStringValue('65');
        expect(second.value).to.equal(2);
      });
    });
  });

  context('with a different step size', () => {
    beforeEach(() => {
      second = new Second(2, 15);
    });

    it('goes up correctly', () => {
      second.stepUpdate(Direction.UP);
      expect(second.value).to.equal(17);

      second.stepUpdate(Direction.UP);
      second.stepUpdate(Direction.UP);
      second.stepUpdate(Direction.UP);
      expect(second.value).to.equal(2);

      second.stepUpdate(Direction.UP);
      expect(second.value).to.equal(17);
    });

    it('goes down correclty', () => {
      second.stepUpdate(Direction.DOWN);
      expect(second.value).to.equal(47);
    });
  });

  describe('will overflow', () => {
    it('returns true if the Seconds will overflow an hour up', () => {
      second.setStringValue('59');
      expect(second.willOverflow(Direction.UP)).to.be.true;
    });

    it('returns true if the Seconds will overflow an hour down', () => {
      second.setStringValue('0');
      expect(second.willOverflow(Direction.DOWN)).to.be.true;
    });

    it('returns true if the Seconds will not overflow', () => {
      second.setStringValue('55');
      expect(second.willOverflow(Direction.DOWN)).to.be.false;
    });
  });
});
