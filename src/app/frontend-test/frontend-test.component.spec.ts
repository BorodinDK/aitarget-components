/* tslint:disable:no-unused-variable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FrontendTestComponent } from './frontend-test.component';

describe('Component: frontend-test', () => {

  let comp: FrontendTestComponent;
  let fixture: ComponentFixture<FrontendTestComponent>;
  let directionElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontendTestComponent]
    });

    fixture = TestBed.createComponent(FrontendTestComponent);
    comp = fixture.componentInstance;
    directionElement = fixture.debugElement
                        .query(By.css('.frontend-test__direction'))
                          .nativeElement;
  });

  it('should display original direction', () => {
    fixture.detectChanges();
    expect(directionElement.textContent).toEqual('-');
  });

  it('should display a different direction', () => {
    comp.direction = 'TEST';
    fixture.detectChanges();
    expect(directionElement.textContent).toEqual('TEST');
  });

  it('should genetate image URL', () => {
    expect(comp.getImageUrl())
      .toEqual('http://unsplash.it/200/200?random=0');
  });
});
