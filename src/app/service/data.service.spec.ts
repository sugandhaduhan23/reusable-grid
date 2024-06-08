import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { environment } from '../../environments/environment.development';
import { DeviceDetails } from '../models/device-details';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('data service should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch device details', () => {
    //This could be any data for testing purpose 
    const mockDeviceDetails: DeviceDetails[] = [
      {name: 'smss.exe', device: 'Mario', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'scheduled' },
      {name: 'netsh.exe', device: 'Luigi', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available'}
    ];
    service.getData().subscribe((deviceDetails: DeviceDetails[]) => {
      expect(deviceDetails).toEqual(mockDeviceDetails);
    });
    const req = httpMock.expectOne(environment.API.GET_DEVICE_INFO);
    expect(req.request.method).toBe('GET');
    //Response from the service
    req.flush(mockDeviceDetails);
  });

  it('api should handle error response', () => {
    const errorMessage = 'Error loading device details';
    service.getData().subscribe({
      next:  ()=> fail('expected an error, not device details'),
      error: (error) => expect(error.message).toContain(errorMessage)
    });
    const req = httpMock.expectOne(environment.API.GET_DEVICE_INFO);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
