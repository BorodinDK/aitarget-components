import { browser, element, by } from 'protractor';

export class DetailedPage {
  static navigateTo () {
    return browser.get('/frontend-test');
  }

  static getBox () {
    return element(by.css('.frontend-test__wrapper'));
  }


  static getDirection () {
    return element(by.css('.frontend-test__direction')).getAttribute('innerHTML');
  }

  static getSrcImageFront () {
    return element(by.css('.frontend-test__front')).getAttribute('src');
  }

  static getSrcImageBack () {
    return element(by.css('.frontend-test__back')).getAttribute('src');
  }

  static clickOnBox (x, y) {
    browser.actions()
      .mouseMove(this.getBox(), {x: x, y: y})
      .click()
      .perform();
  }

  static clickOnTop () {
    this.clickOnBox(100, 10);
  }

  static clickOnRight () {
    this.clickOnBox(190, 100);
  }

  static clickOnBottom () {
    this.clickOnBox(100, 190);
  }

  static clickOnLeft () {
    this.clickOnBox(10, 100);
  }
}
