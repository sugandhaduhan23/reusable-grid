import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceComponent } from './device.component';
import { DataService } from '../../service/data.service';
import { of } from 'rxjs';
import { DeviceDetails } from '../../models/device-details';
import { DynamicPipe } from '../../pipes/dynamic-pipe.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('DeviceComponent', () => {
  let component: DeviceComponent;
  let fixture: ComponentFixture<DeviceComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceComponent, DynamicPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DataService,
          useValue: {
            getData: jest
              .fn()
              .mockReturnValue(
                of([
                  {
                    name: 'uxtheme.dll',
                    device: 'Peach',
                    path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
                    status: 'available',
                  },
                ])
              ),
          },
        },
        DynamicPipe,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeviceComponent);
    dataService = TestBed.inject(DataService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create device component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch device data on initialization', () => {
    component.ngOnInit();
    expect(dataService.getData).toHaveBeenCalled();
    expect(component.deviceDetails).toEqual([
      {
        name: 'uxtheme.dll',
        device: 'Peach',
        path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
        status: 'available',
      },
    ]);
  });

  it('should call disableCheckbox correctly', () => {
    const row = {
      name: 'uxtheme.dll',
      device: 'Peach',
      path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
      status: 'available',
    };
    expect(component.disableCheckbox(row)).toBe(false);
    const rowDisabled = {
      name: 'aries.sys',
      device: 'Daisy',
      path: '\\Device\\HarddiskVolume1\\Windows\\System32\\aries.sys',
      status: 'scheduled',
    };
    expect(component.disableCheckbox(rowDisabled)).toBe(true);
  });

  it('should filter data and open the alert box', () => {
    component.alertBox = { openModal: jest.fn() } as any;
    const selectedRows: DeviceDetails[] = [
      {
        name: 'netsh.exe',
        device: 'Luigi',
        path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
        status: 'available',
      },
    ];
    component.selectedRows(selectedRows);
    expect(component.modalColumns.length).toBe(2);
    expect(component.modalData).toEqual([
      {
        path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
        device: 'Luigi',
      },
    ]);
    expect(component.alertBox.openModal).toHaveBeenCalled();
  });

  it('should unsubscribe on component destruction', () => {
    const ngSubscribeSpy = jest.spyOn(component.ngSubscribe, 'next');
    const ngSubscribeCompleteSpy = jest.spyOn(
      component.ngSubscribe,
      'complete'
    );
    component.ngOnDestroy();
    expect(ngSubscribeSpy).toHaveBeenCalled();
    expect(ngSubscribeCompleteSpy).toHaveBeenCalled();
  });
});
