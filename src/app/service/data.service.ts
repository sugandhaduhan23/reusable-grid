import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { DeviceDetails } from '../models/device-details';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  //Fetch data from json
  getData(): Observable<DeviceDetails[]>{
      return this.http.get<DeviceDetails[]>(environment.API.GET_DEVICE_INFO);
  }
}
