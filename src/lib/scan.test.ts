import { describe, expect, it, vi } from 'vitest';
import { scan } from './scan';

describe('portscan', () => {
  it('exports the scan function', () => {
    expect(typeof scan).toBe('function');
  });

  it('rejects invalid port numbers without invoking a system scan', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    scan('65536', {});

    expect(error).toHaveBeenCalledWith('Port must be a number between 1 and 65535.');
    error.mockRestore();
  });

  it('prints usage guidance when no port or all-port flag is supplied', () => {
    const output = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    scan('', {});

    expect(output).toHaveBeenCalledWith('Usage: portscan <port> [--all] [--kill] [--state <state>]');
    output.mockRestore();
  });
});
