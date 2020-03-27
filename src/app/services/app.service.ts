import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PointOfInterest, PointOfInterestWithoutIdentifier } from '../models/app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
 })
export class AppService {
  url = environment.apiUrl + 'point-of-interest';

  http:HttpClient;
  headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http = httpClient;
  }

  listPointOfInterests(): Observable<PointOfInterest[]> {
    return this.http.get<PointOfInterest[]>(this.url);
  }

  registerPointOfInterest(pointOfInterest: PointOfInterestWithoutIdentifier): Observable<PointOfInterest>  {
    return this.http.post<PointOfInterest>(this.url, pointOfInterest);
  }

  updatePointOfInterest(id: string, pointOfInterest: PointOfInterestWithoutIdentifier) {
    let url = this.url + '/' + id;
    return this.http.put<PointOfInterest>(url, pointOfInterest);
  }

  removePointOfInterest(id: string) {
    let url = this.url + '/' + id;
    return this.http.delete(url);
  }

}
