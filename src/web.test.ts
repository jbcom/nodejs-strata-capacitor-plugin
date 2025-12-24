import { describe, it, expect, vi } from 'vitest';
import { StrataWeb } from './web';

describe('StrataWeb', () => {
  it('should return device info', async () => {
    const plugin = new StrataWeb();
    const info = await plugin.getDeviceInfo();
    expect(info).toHaveProperty('isMobile');
    expect(info.platform).toBe('web');
  });

  it('should handle haptics', async () => {
    const plugin = new StrataWeb();
    const vibrateSpy = vi.fn();
    global.navigator.vibrate = vibrateSpy;

    await plugin.haptics({ type: 'impact', style: 'heavy' });
    expect(vibrateSpy).toHaveBeenCalledWith(100);

    await plugin.haptics({ type: 'selection' });
    expect(vibrateSpy).toHaveBeenCalledWith(10);
  });

  it('should return default safe area insets', async () => {
    const plugin = new StrataWeb();
    const insets = await plugin.getSafeAreaInsets();
    expect(insets).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });
});
