import { describe, it, expect } from 'vitest';
import { scan } from './scan';

describe('portscan', () => {
  it('should export scan function', () => {
    expect(typeof scan).toBe('function');
  });
});
