import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OtherService } from 'src/app/services/other.service';

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
import { AccountService } from 'src/app/services/account.service';
// import { NgForm, UntypedFormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Observable, filter, from, map, mergeMap, of, startWith, toArray } from 'rxjs';
import { PersianNumberService } from 'ngx-persian';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';

@Component({
    selector: 'mapDialog',
    templateUrl: 'mapDialog.Component.html',
})
export class MapDialog {

    location: any = [51.3833554, 35.6770113];

    map: any = {};

    showButton: boolean = true

    mapCursorSrc = '../../../assets/imgs/placeholder.png'


    constructor(public dialogRef: MatDialogRef<MapDialog>, @Inject(MAT_DIALOG_DATA) public data: any,) { }



    ngOnInit(): void {

        if (this.data !== null && this.data.fLon !== 0 && this.data.showAllInMap === undefined) {
            this.location[0] = this.data[0];
            this.location[1] = this.data[1];


            if (this.data.button === false) {
                this.showButton = false

            }

            if (this.data.icon !== undefined) {

                this.mapCursorSrc = this.data.icon;

            }

            setTimeout(() => {

                this.newOpenMap();

            }, 100);

        }

        else if (this.data !== null && this.data.showAllInMap === true) {


            if (this.data.button === false) {

                this.showButton = false

            }

            if (this.data.icon !== undefined) {

                this.mapCursorSrc = this.data.icon;

            }


            setTimeout(() => {

                this.newOpenMapAll();

            }, 100);

        }

    }

    closeModal() {
        this.dialogRef.close({ data: this.location });
    }

    newOpenMap() {
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
                zoom: 17,
            }),
        });

        // initial location

        const marker = new Feature({
            geometry: new Point(olProj.fromLonLat(this.location)),
        });

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [marker],
            }),
            style: new Style({
                image: new Icon({
                    src: this.mapCursorSrc,
                    scale: 0.5,
                }),
            }),
        });

        this.map.addLayer(vectorLayer);

        this.map.on('click', (event) => {

            const clickedLocation = olProj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');

            marker.setGeometry(new Point(olProj.fromLonLat(clickedLocation)));

            this.location = clickedLocation;
        });
    }

    newOpenMapAll() {

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
                zoom: 11,
            }),
        });

        const vectorSource = new VectorSource();

        for (const location of this.data.all_locationData) {
            const marker = new Feature({
                geometry: new Point(olProj.fromLonLat(location)),
            });

            const style = new Style({
                image: new Icon({
                    src: this.mapCursorSrc,
                    scale: 0.5,
                }),
            });

            marker.setStyle(style);

            vectorSource.addFeature(marker);
        }

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        this.map.addLayer(vectorLayer);

        this.map.on('click', (event) => {
            const clickedLocation = olProj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
            this.location = clickedLocation;
        });
    }
}







