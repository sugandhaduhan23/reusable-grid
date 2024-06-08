import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dynamicPipe'
})
export class DynamicPipe implements PipeTransform {

  constructor() {}

  /**
   * Transforms the input value based on the specified pipe name and arguments.
   * @param value - The value to be transformed.
   * @param pipeName - The name of the pipe to apply.
   * @param args - Additional arguments for the pipe.
   * @returns The transformed value.
   */
  transform(value: any, pipeName?: string, ...args: any[]): any {
    if (!pipeName) {
      return value;
    }
    
    switch (pipeName) {
      case 'capitalize':
        return this.capitalize(value);
      default:
        return value; 
    }
  }

  /**
   * Capitalizes the first letter of the input string.
   * @param value - The string to be capitalized.
   * @returns The capitalized string.
   */
  private capitalize(value: string): string {
    if (typeof value !== 'string') {
      return value;
    }
    return value.charAt(0).toUpperCase() + value.substring(1);
  }
}
