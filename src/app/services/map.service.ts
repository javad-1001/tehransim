import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { Circle, LineString, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { getArea, getLength } from "ol/sphere";
declare let $: any;

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() { }

  createMarker(position: any, icon: any, id = '', name = '', data = {}, anchor?: any) {
    let coord4326 = olProj.transform(position, 'EPSG:4326', 'EPSG:3857');
    //let coord4326 = position;
    let feature = new Feature({
      type: 'removable',
      geometry: new Point(coord4326),
      data: data,
    });
    var layerImage = new Icon({
      src: icon,
      scale: name == "MarkerService" ? 0.3 : 1,
      anchor: anchor ? anchor : [0.1, 45],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
    });
    //console.log('layer image: ', layerImage);
    // layerImage.setRotation(Math.PI/2);
    let pinLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
      id: id,

      name: name,
      style: new Style({
        image: layerImage,
      }),
    } as any);
    return pinLayer;
  }
  transformCoordinates(coordinates: any) {
    return olProj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
  }
  transformCoordinates2(coordinates: any) {
    return olProj.transform(coordinates, 'EPSG:4326', 'EPSG:3857');
  }
  mapPointerMove(pixels: any, map: any) {

    var featureLayer = map.forEachFeatureAtPixel(
      pixels,
      function (feature: any, layer: any) {
        return { feature: feature, layer: layer };
      }
    );
    var data = {
      featureLayer: featureLayer,
      pixel: pixels,
    };
    return data;
  }
  drawRoute(
    routeId: any,
    map: any,
    coordinates: any,
    data: any,
    // origCoordinates:any,
    hasRandomcolorLine = false
  ) {
    var color = Math.floor(Math.random() * 16777215).toString(16);

    var startMarker = this.createMarker(
      [coordinates[0].longitude, coordinates[0].latitude],
      "../../assets/Img/marker4.png",
      `${routeId}_start`,
      `route_start`
    );
    var lastCoordinate = coordinates[coordinates.length - 1];
    var endMarker = this.createMarker(
      [lastCoordinate.longitude, lastCoordinate.latitude],
      "../../assets/Img/marker5.png",
      `${routeId}_end`,
      `route_end`,
      {
        html: `<a href="/carInfo/${data.strUnitId}" target='_blank'>
              <h5 class='text-dark'>${data.strFullName} (${data.strMobileType_strComment}) </h5>
              <hr class='text-dark m-1' />
              <div class='justify-content-end d-flex align-items-center'>
                <span class=" text-secondary ms-1"> ${data.fKm} کیلو متر</span>
              <i class="fa fa-user-circle text-secondary "></i>
              </div>
              <div class='justify-content-end d-flex align-items-center'>
              <span class=" text-secondary ms-1">${data.strVehicleNo}</span>
            <i class="fa fa-user-circle text-secondary "></i>
            </div>
            <div class='justify-content-end d-flex align-items-center'>
            <span class=" text-secondary ms-1">${data.strTime}</span>
          <i class="fa fa-user-circle text-secondary "></i>
          </div>
          <div class='justify-content-end d-flex align-items-center'>
          <span class=" text-secondary ms-1">${data.strDate}</span>
        <i class="fa fa-user-circle text-secondary "></i>
        </div>
        <div class='justify-content-end d-flex align-items-center'>
        <span class=" text-secondary ms-1">${data.bonline == true ? data.bonline = 'روشن' : data.bonline = 'خاموش'}</span>
      <i class="fa fa-user-circle text-secondary "></i>
      </div>
      <div class='justify-content-end d-flex align-items-center'>
      <span class=" text-secondary ms-1">${data.bACC == true ? data.bACC = 'باز' : data.bACC = 'بسته'}</span>
    <i class="fa fa-user-circle text-secondary "></i>
    </div>
        </a>`,
      }
    );

    var points = [];
    var pointFeatures = [];

    // var origPoints = [];
    // for (const point of origCoordinates) {
    //   let coord4326 = olProj.transform(
    //     [point.longitude, point.latitude],
    //     "EPSG:4326",
    //     "EPSG:3857"
    //   );
    //   origPoints.push([coord4326[0], coord4326[1]]);
    // }

    for (const point of coordinates) {
      let coord4326 = olProj.transform(
        [point.longitude, point.latitude],
        "EPSG:4326",
        "EPSG:3857"
      );
      points.push([coord4326[0], coord4326[1]]);
      var f = new Feature({
        geometry: new Circle([coord4326[0], coord4326[1]], 0.5),
        data: point.tooltipContent,
        name: "route_point",
      });

      f.setStyle(
        new Style({
          fill: new Fill({
            color: !hasRandomcolorLine ? "#1010fd" : `#${color}`,
          }),
        })
      );
      pointFeatures.push(f);
    }
    var line = new LineString(points);
    //var line2 = new LineString(origPoints);

    var length = getLength(line);
    //var length2 = getLength(line2);
    //console.log('line length: ', length);
    var style = new Style({
      stroke: new Stroke({
        color: !hasRandomcolorLine ? "#0000ff" : `#${color}`,
        width: 1,
      }),
      // strokeColor: '#0000ff',
      // strokeOpacity: 0.7,
      // strokeWidth: 10
    });
    var lineFeature = new Feature({
      geometry: line,
      //style: style
    });
    lineFeature.setStyle(style);

    var lineLayer = new VectorLayer({
      source: new VectorSource({
        features: [lineFeature, ...pointFeatures],
      }),
      id: routeId,
      name: "route_line",
    } as any);
    map.addLayer(startMarker);
    map.addLayer(lineLayer);
    map.addLayer(endMarker);

    return { l1: length };
  }
  drawLine(
    routeId: any,
    map: any,
    coordinates: any,
    data: any,
    // origCoordinates:any,
    hasRandomcolorLine = false,
    colorLine: any
  ) {
    var color = Math.floor(Math.random() * 16777215).toString(16);



    var points = [];
    var pointFeatures = [];

    // var origPoints = [];
    // for (const point of origCoordinates) {
    //   let coord4326 = olProj.transform(
    //     [point.longitude, point.latitude],
    //     "EPSG:4326",
    //     "EPSG:3857"
    //   );
    //   origPoints.push([coord4326[0], coord4326[1]]);
    // }

    for (const point of coordinates) {
      let coord4326 = olProj.transform(
        [point.fLon, point.fLat],
        "EPSG:4326",
        "EPSG:3857"
      );
      points.push([coord4326[0], coord4326[1]]);
      var f = new Feature({
        geometry: new Circle([coord4326[0], coord4326[1]], 0.5),
        data: point.tooltipContent,
        name: "route_point",
      });

      f.setStyle(
        new Style({
          fill: new Fill({
            color: !hasRandomcolorLine ? colorLine : `#${color}`,
          }),
        })
      );
      pointFeatures.push(f);
    }
    var line = new LineString(points);
    //var line2 = new LineString(origPoints);

    var length = getLength(line);
    //var length2 = getLength(line2);
    //console.log('line length: ', length);
    var style = new Style({
      stroke: new Stroke({
        color: !hasRandomcolorLine ? colorLine : `#${color}`,
        width: 3,
      }),
      // strokeColor: '#0000ff',
      // strokeOpacity: 0.7,
      // strokeWidth: 10
    });
    var lineFeature = new Feature({
      geometry: line,
      //style: style
    });
    lineFeature.setStyle(style);

    var lineLayer = new VectorLayer({
      source: new VectorSource({
        features: [lineFeature, ...pointFeatures],
      }),
      id: routeId,
      name: "route_line",
    } as any);
    map.addLayer(lineLayer);

    return { l1: length };
  }






  drawRouteAnimate(
    routeId: any,
    map: any,
    coordinates: any,
    data: any,
    // origCoordinates:any,
    hasRandomcolorLine = false,
    isLivePoint?: any
  ) {
    var color = Math.floor(Math.random() * 16777215).toString(16);
    var startMarker;
    var lastCoordinate = coordinates[coordinates.length - 1];
    var endMarker;
    startMarker = this.createMarker(
      [coordinates[0].fLon, coordinates[0].fLat],
      "../../assets/imgs/marker4.png",
      `${routeId}_start`,
      `route_start`,
      {

      }
    );
    endMarker = this.createMarker(
      [lastCoordinate.fLon, lastCoordinate.fLat],
      "../../assets/imgs/marker6.png",
      `${routeId}_end`,
      `route_end`,

      lastCoordinate,
      [0.5, 55]
    );

    var points = [];
    var pointFeatures = [];
    for (const point of coordinates) {
      let coord4326 = olProj.transform(
        [point.fLon, point.fLat],
        "EPSG:4326",
        "EPSG:3857"
      );
      points.push([coord4326[0], coord4326[1]]);
      var f = new Feature({
        geometry: new Circle([coord4326[0], coord4326[1]], 0),
        data: point.tooltipContent,
        name: "route_point",
      });

      f.setStyle(
        new Style({
          fill: new Fill({
            color: !hasRandomcolorLine ? "#1010fd" : `#${color}`,
          }),
        })
      );
      pointFeatures.push(f);
    }
    var line = new LineString(points);
    var length = getLength(line);
    var style = new Style({
      stroke: new Stroke({
        color: !hasRandomcolorLine ? "#0000ff" : `#${color}`,
        width: 3,
      }),

    });
    var lineFeature = new Feature({
      geometry: line,
      //style: style
    });
    lineFeature.setStyle(style);

    var lineLayer = new VectorLayer({
      source: new VectorSource({
        features: [lineFeature, ...pointFeatures],
      }),
      id: routeId,
      name: "route_lineBus",
    } as any);
    map.addLayer(startMarker);
    map.addLayer(lineLayer);
    map.addLayer(endMarker);

    return { l1: length };
  }
  removeMarkerById(id: any, map: any) {
    let layers = map
      .getLayers()
      .getArray()
      .filter((l: any) => l.values_.id == id);
    for (const item of layers) {
      map.removeLayer(item);
    }

  }
  showData(item: any) {
    var tooltip = document.getElementById("map_tooltip") as any;
    tooltip.tooltip = {};
    tooltip.tooltip({
      animation: true,
      trigger: 'manual',
      placement: 'top',
      html: true,
    });
    tooltip.css({
      left: item.pixel[0] + 'px',
      top: item.pixel[1] - 14 + 'px',
      zindex: 1000,
    });
    if (item.featureLayer) {
      if (item.featureLayer.feature) {
        tooltip
          .attr(
            'data-bs-original-title',
            item.featureLayer.feature.get('data').html
          )
          .tooltip('show');
      }
    } else {
      tooltip.tooltip('hide');
    }
  }
  drawRouteFull(
    routeId: any,
    map: any,
    coordinates: any,
    data: any,
    // origCoordinates:any,
    hasRandomcolorLine = false
  ) {
    var color = Math.floor(Math.random() * 16777215).toString(16);

    var startMarker = this.createMarker(
      [coordinates[0].fLon, coordinates[0].fLat],
      "../../assets/Img/marker4.png",
      `${routeId}_start`,
      `route_start`
    );
    var lastCoordinate = coordinates[coordinates.length - 1];
    var endMarker = this.createMarker(
      [lastCoordinate.fLon, lastCoordinate.fLat],
      "../../assets/Img/marker5.png",
      `${routeId}_end`,
      `route_end`,
      // {
      //   html: '<h5 class="text-dark">'+data+'</h5>',
      // }
    );

    var points = [];
    var pointFeatures = [];
    for (const point of coordinates) {
      let coord4326 = olProj.transform(
        [point.fLon, point.fLat],
        "EPSG:4326",
        "EPSG:3857"
      );
      points.push([coord4326[0], coord4326[1]]);
      var f = new Feature({
        geometry: new Circle([coord4326[0], coord4326[1]], 0),
        data: point.tooltipContent,
        name: "route_point",
      });

      f.setStyle(
        new Style({
          fill: new Fill({
            color: !hasRandomcolorLine ? "#1010fd" : `#${color}`,
          }),
        })
      );
      pointFeatures.push(f);
    }
    var line = new LineString(points);
    var length = getLength(line);
    var style = new Style({
      stroke: new Stroke({
        color: !hasRandomcolorLine ? "#0000ff" : `#${color}`,
        width: 3,
      }),

    });
    var lineFeature = new Feature({
      geometry: line,
      //style: style
    });
    lineFeature.setStyle(style);

    var lineLayer = new VectorLayer({
      source: new VectorSource({
        features: [lineFeature, ...pointFeatures],
      }),
      id: routeId,
      name: "route_line",
    } as any);
    map.addLayer(startMarker);
    map.addLayer(lineLayer);
    map.addLayer(endMarker);

    return { l1: length };
  }
  craeteArrow(position: any, icon: any, id = '', name = '', data = {}, Rotation: any) {
    let coord4326 = olProj.transform(position, 'EPSG:4326', 'EPSG:3857');
    let feature = new Feature({
      type: 'removable',
      geometry: new Point(coord4326),
      data: data,
    });
    var layerImage = new Icon({
      src: icon,
      anchor: [0.59, 10],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      rotation: Math.PI * Rotation / 180,

    });

    // console.log('layer image: ', layerImage);
    // layerImage.setRotation( Math.atan2(Rotation[1][0] - Rotation[0][0], Rotation[1][1] - Rotation[0][1]));

    let pinLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
      id: id,
      name: name,
      style: new Style({
        image: layerImage,
      }),
    } as any);
    return pinLayer;
  }
  removeLayerByName(name: any, map: any) {
    let layers = map
      .getLayers()
      .getArray()
      .filter((l: any) => l.values_.name == name);

    for (const item of layers) {
      map.removeLayer(item);
    }
  }
  fitMap(data: any, map: any) {

    //remove car not have Location
    data = data.filter(function (el: any) {
      return el.fLon != 0;
    });

    var maxLatitude = Math.max.apply(
      Math,
      data.map(function (o: any) {
        return o.fLat;
      })
    );
    var maxLongitude = Math.max.apply(
      Math,
      data.map(function (o: any) {
        return o.fLon;
      })
    );
    var minLatitude = Math.min.apply(
      Math,
      data.map(function (o: any) {
        return o.fLat;
      })
    );
    var minLongitude = Math.min.apply(
      Math,
      data.map(function (o: any) {
        return o.fLon;
      })
    );

    var view = map.getView();

    var transformedStart = this.transformCoordinates2([
      maxLongitude,
      maxLatitude,
    ]);
    var transformedEnd = this.transformCoordinates2([
      minLongitude,
      minLatitude,
    ]);

    var source = [
      Math.min(transformedStart[0], transformedEnd[0]) - 500,
      Math.min(transformedStart[1], transformedEnd[1]) - 500,
      Math.max(transformedStart[0], transformedEnd[0]) + 500,
      Math.max(transformedStart[1], transformedEnd[1]) + 500,
    ];
    view.fit(source);
    if (data.length == 1) {
      map.getView().setZoom(17);
    }
  }

}
