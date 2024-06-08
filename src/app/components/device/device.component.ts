import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../service/data.service';
import { Subject, takeUntil } from 'rxjs';
import { DeviceDetails } from '../../models/device-details';
import { TableColumn } from '../../models/table-column';
import { TableConfig } from '../../models/table-config';
import { AlertBoxComponent } from '../../common/alert-box/alert-box.component';
import { DynamicPipe } from '../../pipes/dynamic-pipe.pipe';
import { environment as ENV } from '../../../environments/environment.development';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  // Reference to the alert box modal component
  @ViewChild('alertBox') alertBox!: AlertBoxComponent;
  // Subject used for unsubscribing from observables to prevent memory leaks
  ngSubscribe = new Subject<void>();
  deviceDetails!: DeviceDetails[];
  // Configuration for the table
  tableConfig: TableConfig = {
    headerCheckboxSelection: true,
    showHeader: true,
    hideDownload: false,
    checkBoxSelection: true,
    /** 
      Uncomment this config below to see a different view of the table.
      The checkboxes will be disabled with status other than available
      and the user will be able to select only the enabled checkboxes.
      This code has already been uncommented in the Device1Component 
      to showcase the implemenation
    */
    //disableCheckbox: this.disableCheckbox 
  };

  // Column definitions for the table
  columns: TableColumn[] = [
    {
      field: ENV.TABLE_CONSTANTS.NAME_FIELD,
      header:  ENV.TABLE_CONSTANTS.NAME_HEADER,
      ariaLabel: ENV.ARIA_CONSTANTS.NAME_ARIA_LABEL
    },
    {
      field: ENV.TABLE_CONSTANTS.DEVICE_FIELD,
      header:  ENV.TABLE_CONSTANTS.DEVICE_HEADER,
      ariaLabel: ENV.ARIA_CONSTANTS.DEVICE_ARIA_LABEL
    },
    {
      field: ENV.TABLE_CONSTANTS.PATH_FIELD,
      header:  ENV.TABLE_CONSTANTS.PATH_HEADER,
      ariaLabel: ENV.ARIA_CONSTANTS.PATH_ARIA_LABEL
    },
    {
      field: ENV.TABLE_CONSTANTS.STATUS_FIELD,
      header:  ENV.TABLE_CONSTANTS.STATUS_HEADER,
      ariaLabel: ENV.ARIA_CONSTANTS.STATUS_ARIA_LABEL,
      cellRenderer: (value: any) => {
        // Custom HTML and style in a cell
        return value.toLowerCase() === 'available'
          ? `<div style="display:flex;align-items:center">
                <div style="display: inline-block; margin-left:-25px; margin-right: 10px; width: 15px; 
                height: 15px; background-color: #71bc71; border-radius: 50%;">
                </div>
                <div>${this.dynamicPipe.transform(value, ENV.CONSTANTS.CAPITALIZE_PIPE)}</div>
              </div>`
          : this.dynamicPipe.transform(value, ENV.CONSTANTS.CAPITALIZE_PIPE);
      },
    },
  ];

  // Data and configuration for the modal
  modalData!: any[];
  modalColumns: TableColumn[] = [];
  modalDataConfig!: TableConfig;

  CONSTANTS = ENV.CONSTANTS;
  ARIA_CONSTANTS = ENV.ARIA_CONSTANTS;

  constructor(private dataService: DataService,
              private dynamicPipe: DynamicPipe) {}

  /**
   * Lifecycle hook that runs after the component's view has been initialized
   */
  ngOnInit() {
    this.getDeviceData();
  }

  /**
   * Method to fetch device data from the data service
   */
  getDeviceData() {
    this.dataService.getData().pipe(
      takeUntil(this.ngSubscribe) // Automatically unsubscribe when `ngSubscribe` emits
    ).subscribe((deviceData: DeviceDetails[]) => {
      this.deviceDetails = deviceData;
    });
  }

  /**
   * Method to determine if a checkbox should be disabled based on the row data
   * @param row - The row data to evaluate
   * @returns true if the checkbox should be disabled, false otherwise
   */
  disableCheckbox(row: any): boolean {
    return row.status.toLowerCase() !== ENV.CONSTANTS.AVAILABLE;
  }

  /**
   * Method to handle selected rows and display them in a modal
   * @param selectedRows - Array of selected device details
   */
  selectedRows(selectedRows: DeviceDetails[]): void {
    this.modalColumns = [
      {
        field: ENV.TABLE_CONSTANTS.DEVICE_FIELD,
        header:  ENV.TABLE_CONSTANTS.DEVICE_HEADER,
        ariaLabel: ENV.ARIA_CONSTANTS.DEVICE_ARIA_LABEL
      },
      {
        field: ENV.TABLE_CONSTANTS.PATH_FIELD,
        header:  ENV.TABLE_CONSTANTS.PATH_HEADER,
        ariaLabel: ENV.ARIA_CONSTANTS.PATH_ARIA_LABEL
      },
    ];
    this.modalData = selectedRows
      .filter((item: DeviceDetails) => item.status === ENV.CONSTANTS.AVAILABLE)
      .map(({ path, device }) => ({ path, device }));
    this.alertBox.openModal();
  }

  /**
   * Lifecycle hook that runs when the component is about to be destroyed
   */
  ngOnDestroy() {
    this.ngSubscribe.next();
    this.ngSubscribe.complete();
  }
}
