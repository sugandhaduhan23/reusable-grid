import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiGridComponent } from './ui-grid.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';
import { TableConfig } from '../../models/table-config';

describe('UiGridComponent', () => {
  let component: UiGridComponent;
  let fixture: ComponentFixture<UiGridComponent>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiGridComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: { bypassSecurityTrustHtml: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiGridComponent);
    sanitizer = TestBed.inject(DomSanitizer);
    component = fixture.componentInstance;
    component.data = [
      {
        name: 'smss.exe',
        device: 'Mario',
        path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
        status: 'scheduled',
      },
      {
        name: 'netsh.exe',
        device: 'Luigi',
        path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
        status: 'available',
      },
    ];
    fixture.detectChanges();
  });

  it('should create UI Grid component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component state based on input configuration', () => {
    component.tableConfig = {
      headerCheckboxSelection: true,
      showHeader: true,
      hideDownload: false,
      checkBoxSelection: true,
      disableCheckbox: ()=> false
    };
    component.ngOnInit();
    expect(component.showHeader).toBe(true);
    expect(component.headerCheckboxSelection).toBe(true);
    expect(component.hideDownload).toBe(false);
    expect(component.checkBoxSelection).toBe(true);
    expect(component.disabledRows.size).toBe(0);
    expect(component.selectableRows).toEqual(component.data);
  });

  it('should return the correct size of selectedRows', () => {
    expect(component.selectedCount).toBe(0);
    component.selectedRows.add(component.data[0]);
    expect(component.selectedCount).toBe(1);
  });

  it('should toggle the selection state of a row', () => {
    const row = component.data[0]
    component.toggleSelection(row);
    expect(component.selectedRows.has(row)).toBe(true);
    component.toggleSelection(row);
    expect(component.selectedRows.has(row)).toBe(false);
  });

  it('should select all rows when toggleAllSelection is called and selectAll is true', () => {
    component.disabledRows = new Set();
    component.toggleAllSelection();
    expect(component.selectAll).toBe(true);
    expect(component.selectedRows.size).toBe(2);
    expect(component.selectedRows.has(component.data[0])).toBe(true);
    expect(component.selectedRows.has(component.data[1])).toBe(true);
  });

  it('should clear all selected rows when toggleAllSelection is called and selectAll is false', () => {
    component.selectedRows.add(component.data[0]);
    component.selectedRows.add(component.data[1]);
    component.toggleAllSelection();
    component.toggleAllSelection();
    expect(component.selectAll).toBe(false);
    expect(component.selectedRows.size).toBe(0);
  });

  it('should not select disabled rows when toggleAllSelection is called', () => {
    component.disabledRows = new Set([component.data[0]]);
    component.toggleAllSelection();
    expect(component.selectAll).toBe(true);
    expect(component.selectedRows.size).toBe(1);
    expect(component.selectedRows.has(component.data[0])).toBe(false);
    expect(component.selectedRows.has(component.data[1])).toBe(true);
  });

  it('should return true when some but not all rows are selected', () => {
    component.selectableRows = component.data;
    component.selectedRows.add(component.selectableRows[0]);
    expect(component.isSomeSelected()).toBe(true);
  });

  it('should return false when some but not all rows are selected', () => {
    component.selectableRows = component.data;
    component.selectedRows.add(component.selectableRows[0]);
    component.selectedRows.add(component.selectableRows[1]);
    expect(component.isSomeSelected()).toBe(false);
  });

  it('should check if a specific row is selected', () => {
    const row = component.data[0]
    component.toggleSelection(row);
    expect(component.isSelected(row)).toBe(true);
  });

  it('should sanitize HTML content', () => {
    const htmlContent = '<div>Test</div>';
    const safeHtml: SafeHtml = {} as SafeHtml;
    (sanitizer.bypassSecurityTrustHtml as jest.Mock).mockReturnValue(safeHtml);
    const result = component.sanitize(htmlContent);
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(htmlContent);
    expect(result).toBe(safeHtml);
  });

  it('should disable checkboxes correctly', () => {
    const tableConfig: TableConfig = {
      headerCheckboxSelection: false,
      showHeader: false,
      hideDownload: false,
      checkBoxSelection: false,
      disableCheckbox: (row: any) => row.status !== 'available'
    };
    component.tableConfig = tableConfig;
    component.ngOnInit();
    expect(component.disabledRows.has(component.data[0])).toBe(true);
    expect(component.disabledRows.has(component.data[1])).toBe(false);
  });

  it('should check if the checkbox for a row is disabled', () => {
    const row = component.data[0]
    component.disabledRows.add(row);
    expect(component.isCheckboxDisabled(row)).toBe(true);
    const row2 = component.data[1]
    expect(component.isCheckboxDisabled(row2)).toBe(false);
  });

  it('should emit the selected rows event on download seleceted click', () => {
    jest.spyOn(component.selectedRowsEvent, 'emit');
    const row = component.data[0]
    component.toggleSelection(row);
    component.downloadSelected();
    expect(component.selectedRowsEvent.emit).toHaveBeenCalledWith([row]);
  });

  it('should track items by their index', () => {
    expect(component.trackByIndex(0)).toBe(0);
  });
});
