import {
  Component, OnInit, ViewEncapsulation, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ViewContainerRef, Output,
  EventEmitter, Input
} from '@angular/core';
import { GeoTargetingMapService } from './geo-targeting-map.service';
import { GeoTargetingItem } from '../geo-targeting-item.interface';
import { GeoTargetingSelectedService } from '../geo-targeting-selected/geo-targeting-selected.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ComponentsHelperService } from '../../shared/services/components-helper.service';
import { Subject } from 'rxjs';
import { AppState } from '../../../app/reducers/index';
import { Store } from '@ngrx/store';

@Component({
  selector:        'geo-targeting-map',
  templateUrl:     './geo-targeting-map.component.html',
  styleUrls:       ['./geo-targeting-map.component.scss', '../../../../node_modules/leaflet/dist/leaflet.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class GeoTargetingMapComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  modelSelected$;

  @Input() isOpen;

  @Output() toggleMap = new EventEmitter();

  pinMode;

  constructor (private _store: Store<AppState>,
               private geoTargetingMapService: GeoTargetingMapService,
               private translateService: TranslateService,
               private componentsHelperService: ComponentsHelperService,
               private geoTargetingSelectedService: GeoTargetingSelectedService,
               private changeDetectorRef: ChangeDetectorRef,
               private viewContainerRef: ViewContainerRef) {
    this.componentsHelperService.setRootViewContainerRef(viewContainerRef);
    this.modelSelected$ = this._store.let(this.geoTargetingSelectedService.getModel);
  }

  ngOnDestroy () {
    this.destroy$.next();
  }

  ngOnInit () {
    this.geoTargetingMapService.initializeMap();

    // Update map when selected items change
    this.modelSelected$
        .takeUntil(this.destroy$)
        .filter(() => this.isOpen)
        .map((model) => model.items)
        .subscribe((items: GeoTargetingItem[]) => {
          // Clear all existing items layers
          for (let key in this.geoTargetingMapService.itemsMap) {
            if (this.geoTargetingMapService.itemsMap.hasOwnProperty(key)) {
              this.geoTargetingMapService.itemsMap[key].featureGroup.clearLayers();
            }
          }

          // Draw selected items on the map
          items.forEach((item: GeoTargetingItem) => {
            this.geoTargetingMapService.drawItem(item);
          });

          // If has items focus on the fist active or first in the list, if not - show world
          if (items.length) {
            const activeItems = items.filter((item) => item.active);
            const itemToFocus = activeItems.length ? activeItems[0] : items[0];
            this.geoTargetingMapService.focusItem(itemToFocus);
          } else {
            this.geoTargetingMapService.setView();
          }
        });

    // Subscribe to map's pin mode flag
    this.geoTargetingMapService.pinMode
        .takeUntil(this.destroy$)
        .filter(() => this.isOpen)
        .subscribe((pinMode) => {
          this.pinMode = pinMode;
          if (pinMode) {
            this.geoTargetingMapService.enterPinMode();
          } else {
            this.geoTargetingMapService.exitPinMode();
          }
          this.changeDetectorRef.markForCheck();
        });

    /**
     * Update map when language change
     */
    this.translateService.onLangChange
        .takeUntil(this.destroy$)
        .subscribe((event) => {
          this.geoTargetingMapService.setTileUrl(this.geoTargetingMapService.getTileUrl(event.lang), false);
          this.changeDetectorRef.markForCheck();
        });
  }

}
