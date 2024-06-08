//More table level configs can be added to make the to scale the component
export interface TableConfig {
    showHeader?: boolean; // Hide/Show the entire header
    hideDownload?:boolean; // Hide/show Download Button
    headerCheckboxSelection?: boolean; // Show/Hide the select all checkbox in the header 
    checkBoxSelection?: boolean; // Enable row selection
    disableCheckbox?: ((row: any) => boolean); //Function to disable checkboxes in a row based on a condition
}
