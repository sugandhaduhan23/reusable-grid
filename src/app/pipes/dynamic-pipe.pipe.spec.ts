import { DynamicPipe } from './dynamic-pipe.pipe';

describe('DynamicPipe', () => {
  let pipe: DynamicPipe;

  beforeEach(() => {
    pipe = new DynamicPipe();
  });

  it('dynamic pipe instance should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original value if no pipe name is provided', () => {
    const value = 'test';
    expect(pipe.transform(value)).toBe(value);
  });

  it('should capitalize the first letter of the input string if pipe name is "capitalize"', () => {
    const value = 'test';
    expect(pipe.transform(value, 'capitalize')).toBe('Test');
  });

  it('should return the original value if pipe name does not match any case', () => {
    const value = 'test';
    expect(pipe.transform(value, 'nonexistentPipe')).toBe(value);
  });

  it('should return the original value if value is not a string and pipe name is "capitalize"', () => {
    const value = 123;
    expect(pipe.transform(value, 'capitalize')).toBe(value);
  });
});
