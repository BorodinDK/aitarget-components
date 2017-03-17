import {
  Component,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector:     'fba-frontend-test',
  templateUrl:  './frontend-test.component.html',
  styleUrls:   ['./frontend-test.component.scss']
})

export class FrontendTestComponent {

  imageSize = 200;
  imageSource = 'http://unsplash.it/' + this.imageSize + '/' + this.imageSize;
  imageNumber = 0;
  imageURL = [this.imageSource, false];
  direction = '-';
  style = {};
  rotate = {x: 0, y: 0};
  viewFront = true;

  constructor(private sanitizer: DomSanitizer) {}

  getImageUrl() {
    return this.imageSource + '?random=' + (this.imageNumber++);
  }

  imageClick (e) {
    this.viewFront = !this.viewFront;
    this.imageURL[ this.viewFront ? 1 : 0 ] = this.getImageUrl();

    this.direction = ['right', 'up', 'down', 'left']
                     [(e.offsetX < e.offsetY ? 2 : 0) + (e.offsetX < 200 - e.offsetY ? 1 : 0)];

    if (this.direction === 'right') { this.rotate.y += 180; }
    if (this.direction === 'left') { this.rotate.y -= 180; }
    if (this.direction === 'up') { this.rotate.x += 180; }
    if (this.direction === 'down') { this.rotate.x -= 180; }

    this.style = this.sanitizer.bypassSecurityTrustStyle('rotateY(' + this.rotate.y + 'deg) rotateX(' + this.rotate.x + 'deg)');
  }
}
