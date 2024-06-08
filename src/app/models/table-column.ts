//More column level configs can be added to make the to scale the component
export interface TableColumn {
    field: string; // Property name to take from the data, its required config.
    header: string; // Column header to show on the table, its required config.
    ariaLabel: string;// Aria labels for accessibility
    class?: string; // Style class in order to provide specific style at column level
    width?: string; // Width of a specific column
    pipe?: string; // Pipe name to transform the values on columns
    hide?: boolean; // Hides a specific column
    headerClass?: boolean; // Style class for header text
    valueRenderer?: (value: any, row?: any) => any; // Function change the value
    cellRenderer?: (value: any, row?: any) => string; // Function to insert html in the required cell
}
