import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '../../models/table-column';
import { TableConfig } from '../../models/table-config';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'ui-grid',
  templateUrl: './ui-grid.component.html',
  styleUrl: './ui-grid.component.scss',
})
export class UiGridComponent {
  // Inputs for the component received from parent component
  @Input() columns: TableColumn[] = []; 
  @Input() tableConfig!: TableConfig;
  @Input() data: any[] = [];

  // Output event emitter for selected rows
  @Output() selectedRowsEvent = new EventEmitter<any[]>();

  // Internal state management
  selectedRows: Set<any> = new Set<any>(); // Set to manage selected rows
  disabledRows: Set<any> = new Set<any>(); // Set to manage disabled rows
  selectableRows: any [] = [];
  isIndeterminate = false; 
  selectAll = false;

  // Configuration flags
  headerCheckboxSelection!: boolean;
  showHeader!: boolean;
  hideDownload!: boolean;
  checkBoxSelection!: boolean;
  checkBoxDisabled!: boolean;

  CONSTANTS = environment.CONSTANTS;
  ARIA_CONSTANTS = environment.ARIA_CONSTANTS;

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Lifecycle hook to initialize component state based on input configuration
   */
  ngOnInit() {
    const {
      headerCheckboxSelection = false,
      showHeader = false,
      hideDownload = false,
      checkBoxSelection = false,
      disableCheckbox = false
    } = this.tableConfig || {};

    if (showHeader) {
      this.showHeader = showHeader;
      this.headerCheckboxSelection = headerCheckboxSelection;
      this.hideDownload = hideDownload;
    }

    this.checkBoxSelection = checkBoxSelection;
    if (disableCheckbox){
        this.checkDisabledRows();
        this.selectableRows = this.data.filter(row => !this.disabledRows.has(row));
    }else{
        this.selectableRows = this.data;
    }
      
  }

  /**
   * Getter for the count of selected rows
   * @returns {number} The number of selected rows
   */
  get selectedCount(): number {
    return this.selectedRows.size;
  }

  /**
   * Method to toggle the selection state of a row
   * @param {any} row - The row data to toggle selection state for
   */
  toggleSelection(row: any): void {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.selectAll = this.isAllSelected();
  }

  /**
   * Method to check if all rows are selected excluding disabled rows
   * @returns {boolean} True if all rows are selected, false otherwise
   */
  isAllSelected(): boolean {
    return this.selectableRows.length > 0 && this.selectableRows.length === this.selectedRows.size;
  }

  /**
   * Method to check if some but not all rows are selected excluding disabled rows
   * @returns {boolean} True if some but not all rows are selected, false otherwise
   */
  isSomeSelected(): boolean {
    return this.selectedRows.size > 0 && this.selectedRows.size < this.selectableRows.length;
  }

  /**
   * Method to check if a specific row is selected 
   * @param {any} row - The row data to check selection state for
   * @returns {boolean} True if the row is selected, false otherwise
   */
  isSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  /**
   * Method to toggle the selection state of all rows excluding disabled rows
   */
  toggleAllSelection(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.data.forEach(row => {
        if (!this.disabledRows.has(row)) {
          this.selectedRows.add(row);
        }
      });
    } else {
      this.selectedRows.clear();
    }
  }

  /**
   * Method to sanitize HTML content
   * @param {string} html - The HTML content to sanitize
   * @returns {SafeHtml} The sanitized HTML content
   */
  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Method to check if the checkbox for a row should be disabled
   */
  checkDisabledRows() {
    const disableCheckbox = this.tableConfig.disableCheckbox!;
    this.data.forEach(row => {
      if (disableCheckbox(row))
         this.disabledRows.add(row);
    });
  }

  /**
   * Method to check if a checkbox for a specific row is disabled
   * @param {any} row - The row data to check
   * @returns {boolean} True if the checkbox for the row is disabled, false otherwise
   */
  isCheckboxDisabled(row: any): boolean {
    return this.disabledRows.has(row);
  }

  /**
   * Method to track items by their index
   * @param {number} index - The index of the item
   * @returns {number} The same index
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Method to emit the selected rows event
   */
  downloadSelected() {
    this.selectedRowsEvent.emit(Array.from(this.selectedRows));
  }
}
