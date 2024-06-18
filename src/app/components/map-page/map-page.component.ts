import {
    Component,
    OnInit,
    Input,
    AfterViewInit,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    OnDestroy,
    ElementRef,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import {
    DragRotateAndZoom,
    defaults as defaultInteractions,
} from 'ol/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import { MapService } from 'src/app/services/map.service';
import { Location } from '@angular/common';
declare var bootstrap: any;
@Component({
    selector: 'map-page',
    templateUrl: './map-page.component.html',
    styleUrls: ['./map-page.component.css']

})
export class MapPageComponent implements OnInit {
    constructor(
        private router: Router,
        private mapService: MapService,
        private route: ActivatedRoute,
        private _location: Location) { }
    map: any = {};
    location: any = [51.3833554, 35.6770113];
    flon: any;
    flat: any;
    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.flon = params['flon'] == undefined ? 0 : params['flon'];
            this.flat = params['flat'] == undefined ? 0 : params['flat'];
            this.location = [this.flat, this.flon]
        });
        setTimeout(() => {
            this.newOpenMap();

        }, 100);

        setTimeout(() => {


            this.map.getView().on('propertychange', (e: any) => {
                this.location = olProj.transform(e.target.values_.center, 'EPSG:3857', 'EPSG:4326');
            });
        }, 300);

    }
    newOpenMap() {
        if (this.flon == 0) {
            this.map = new Map({
                interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
                target: 'test',
                layers: [
                    new TileLayer({
                        source: new OSM({}),
                    }),
                ],
                view: new View({
                    center: olProj.fromLonLat([51.3833554, 35.6770113]),
                    zoom: 12,
                }),
            });
        }
        else {
            this.map = new Map({
                interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
                target: 'test',
                layers: [
                    new TileLayer({
                        source: new OSM({}),
                    }),
                ],
                view: new View({
                    center: olProj.fromLonLat(this.location),
                    zoom: 15,
                }),
            });
        }

        //context menu
    }
    setLocation() {
        if (this.flon) {
            this.router.navigate([`shahrnik/profile/${this.location[0]}/${this.location[1]}`]);

        }
        else {
            if ((<any>window).req != undefined) {
                this.router.navigate([`shahrnik/citizenReq/${this.location[0]}/${this.location[1]}`]);
            }
            else {
                if (this.location[1] == 0) {
                    this.location[0]=51.3833554;
                    this.location[1]=35.6770113;
                }
                this.router.navigate([`register/${this.location[0]}/${this.location[1]}`]);
            }

        }

    }

}
