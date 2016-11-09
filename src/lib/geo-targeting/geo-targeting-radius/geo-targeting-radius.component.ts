import {
  Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation
} from '@angular/core';
import { GeoTargetingItem } from '../geo-targeting-item.interface';
import { GeoTargetingSelectedService } from '../geo-targeting-selected/geo-targeting-selected.service';
import { GeoTargetingService } from '../geo-targeting.service';
import { Subject } from 'rxjs';
import {
  MILE_MIN, KILOMETER_MIN, MILE_MAX, KILOMETER_MAX, CUSTOM_LOCATION_RADIUS_MIN
} from './geo-targeting-radius.constants';

@Component({
  selector:        'geo-targeting-radius',
  templateUrl:     './geo-targeting-radius.component.html',
  styleUrls:       ['./geo-targeting-radius.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class GeoTargetingRadiusComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  _itemOriginal;
  _itemCopy;

  @Input() set item (item) {
    this._itemOriginal = item;
    this._itemCopy     = Object.assign({}, item);
  }

  get item (): GeoTargetingItem {
    return this._itemCopy;
  }

  isOpen: boolean = false;
  max;
  min: number     = 0;

  /**
   * Set default radius min and max
   */
  setDefaultBoundaries () {
    this.min = this.item.distance_unit === 'mile' ? MILE_MIN : KILOMETER_MIN;

    /**
     * Minimum radius for custom_location is different.
     * @See https://developers.facebook.com/docs/marketing-api/targeting-specs#location
     */
    if (['custom_location', 'place'].includes(this.item.type)) {
      this.min = CUSTOM_LOCATION_RADIUS_MIN;
    }

    this.max = this.item.distance_unit === 'mile' ? MILE_MAX : KILOMETER_MAX;

    this.changeDetectorRef.markForCheck();
  }

  /**
   * Change distance unit
   * @param distanceUnit
   */
  setDistanceUnit (distanceUnit) {
    this.item.distance_unit = distanceUnit;
    this.setDefaultBoundaries();
    this.onChange(this.item.radius);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Open/Close radius selection dropdown
   */
  toggleDropdown () {
    this.isOpen = !this.isOpen;

    // Restore original item when closing dropdown
    if (!this.isOpen) {
      this.item = this._itemOriginal;
    }

    this.changeDetectorRef.markForCheck();
  }

  /**
   * Enable radius by returning original item state
   */
  enableRadius () {
    this.item = this._itemOriginal;
    if (this.item.radius === 0) {
      this.item.radius = this.min;
    }
  }

  /**
   * Disable radius by setting radius to 0
   */
  disableRadius () {
    this.item.radius = 0;
  }

  /**
   * When radius change
   * @param radius
   */
  onChange (radius) {
    if (radius === null) {
      return;
    }
    if (radius < this.min) {
      return this.onChange(this.min);
    }
    if (radius > this.max) {
      return this.onChange(this.max);
    }
    this.item.radius = radius;
    this.changeDetectorRef.markForCheck();
  }

  constructor (private geoTargetingSelectedService: GeoTargetingSelectedService,
               private geoTargetingService: GeoTargetingService,
               private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnDestroy () {
    this.destroy$.next();
  }

  ngOnInit () {
    this.setDefaultBoundaries();

    /**
     * Process Escape when dropdown is open
     */
    this.geoTargetingService.escapeStream
        .merge(this.geoTargetingService.clickOutsideOfGeoStream)
        .takeUntil(this.destroy$)
        .filter(() => this.isOpen)
        .subscribe(() => {
          this.toggleDropdown();
        });

    this.geoTargetingService.arrowUpStream
        .do((e: KeyboardEvent) => e.preventDefault())
        .mapTo(1)
        .takeUntil(this.destroy$)
        .merge(this.geoTargetingService.arrowDownStream
                   .do((e: KeyboardEvent) => e.preventDefault())
                   .mapTo(-1))
        .filter(() => this.isOpen)
        .subscribe((delta) => {
          this.item.radius += delta;
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        });

    /**
     * Process Enter when dropdown is open
     */
    this.geoTargetingService.enterStream
        .takeUntil(this.destroy$)
        .filter(() => this.isOpen)
        .subscribe(() => {
          // Close dropdown and save value
          this.isOpen = false;
          this.changeDetectorRef.markForCheck();
          // Update item with current radius
          this.geoTargetingSelectedService.updateItems([this.item]);
        });
  }

}
