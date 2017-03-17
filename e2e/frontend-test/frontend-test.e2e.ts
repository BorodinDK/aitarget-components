import { DetailedPage as page } from './frontend-test.po';

describe('frontend-test', function () {
  beforeAll(() => {
    page.navigateTo();
  });

  describe(`set images`, () => {
    it('should have set URL on front image', () => {
      page.clickOnTop();
      expect(page.getSrcImageFront()).toBe('http://unsplash.it/200/200?random=0');
    });

    it('should have set URL on back image', () => {
      page.clickOnTop();
      expect(page.getSrcImageBack()).toBe('http://unsplash.it/200/200?random=1');
    });
  });

  describe(`clicks`, () => {
    it('should have direction UP on click top', () => {
      page.clickOnTop();
      expect(page.getDirection()).toBe('up');
    });

    it('should have direction RIGHT on click right', () => {
      page.clickOnRight();
      expect(page.getDirection()).toBe('right');
    });

    it('should have direction DOWN on click bottom', () => {
      page.clickOnBottom();
      expect(page.getDirection()).toBe('down');
    });

    it('should have direction LEFT on click bottom', () => {
      page.clickOnLeft();
      expect(page.getDirection()).toBe('left');
    });
  });
});
