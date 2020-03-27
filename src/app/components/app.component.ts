import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AppService } from '../services/app.service';
import { PointOfInterest, PrettyCoordinates } from '../models/app.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})
export class AppComponent implements AfterViewInit, OnInit {
  appService: AppService;

  map:any = null;

  coordinates = [];
  mapCoordinates = [];

  selectedCoordinate;
  defaultCoordinates = [-19.9282481,-43.9575825,17];

  form: FormGroup;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  ngAfterViewInit() {
    this.map = L.map('map').setView([43.068661, 141.350755], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.setupCoordinatesAndMap();
  }

  ngOnInit() {
    this.form = new FormGroup({
      'coordinates': new FormControl(null, [Validators.required, Validators.pattern(/^(-?\d+\.\d+),(-?\d+\.\d+),(\d+z?)?$/)]),
      'description': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.form);
  }

  private setupCoordinatesAndMap() {
    this.getCoordinatesList().subscribe((coordinates: PrettyCoordinates[]) => {
      if (this.coordinates.length > 0) {
        this.coordinates = [];
        this.removeMarkersFromMap(this.mapCoordinates);
      }

      this.coordinates = coordinates;
      this.mapCoordinates = this.createMapMarkerFromCoordinates(coordinates, this.map);

      this.setCoordinateView(this.coordinates[this.coordinates.length-1]);
    });
  }

  private getCoordinatesList(): Observable<PrettyCoordinates[]> {
    return this.appService.listPointOfInterests().pipe(
      map((pointOfInterests) => this.transformCoordenates(pointOfInterests))
    );
  }

  private transformCoordenates(coordinates: PointOfInterest[]): PrettyCoordinates[] {
    let transformedCoordenates = [];

    if (coordinates.length > 0) {
      coordinates.forEach(c => {
        let parsedCoordinate = c.coordinates.match(/^(-?\d+\.\d+),(-?\d+\.\d+),(\d+z?)?$/);
        if (c != null) {
          transformedCoordenates.push({
            coordinateX: parsedCoordinate[1],
            coordinateY: parsedCoordinate[2],
            zoomLevel: parsedCoordinate[3],
            description: c.description
          });
        }
      });
    }

    return transformedCoordenates;
  }

  private createMapMarkerFromCoordinates(prettyCoordinates: PrettyCoordinates[], map:L.Map): L.Marker<any>[] {
    let mapMarkers = [];

    prettyCoordinates.forEach(c => {
      mapMarkers.push(L.marker([c.coordinateX, c.coordinateY]).bindPopup(c.description).addTo(map));
    });

    return mapMarkers;
  }

  private removeMarkersFromMap(markers: L.Marker<any>[]) {
    markers.forEach(m => {
      m.remove();
    });
  }

  private setCoordinateView(prettyCoordinates: PrettyCoordinates) {
    //this.map.setView([prettyCoordinates.coordinateX, prettyCoordinates.coordinateY], prettyCoordinates.zoomLevel);
  }
}
