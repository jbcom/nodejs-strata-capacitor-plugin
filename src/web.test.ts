/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrataWeb } from './web';

describe('StrataWeb', () => {
  let plugin: StrataWeb;

  beforeEach(() => {
    plugin = new StrataWeb();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.remove();
    }
  });

  it('should return device info', async () => {
    const info = await plugin.getDeviceInfo();
    expect(info).toHaveProperty('isMobile');
    expect(info.platform).toBe('web');
  });

  it('should handle haptics', async () => {
    // navigator.vibrate might not exist in jsdom or might be a stub
    if (!('vibrate' in navigator)) {
      // biome-ignore lint/suspicious/noExplicitAny: needed for testing
      (navigator as any).vibrate = vi.fn();
    }
    const vibrateSpy = vi.spyOn(navigator, 'vibrate');

    await plugin.haptics({ type: 'impact', style: 'heavy' });
    expect(vibrateSpy).toHaveBeenCalledWith(100);

    await plugin.haptics({ type: 'selection' });
    expect(vibrateSpy).toHaveBeenCalledWith(10);
  });

  it('should return default safe area insets', async () => {
    const insets = await plugin.getSafeAreaInsets();
    expect(insets).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  it('should configure touch handling', async () => {
    await plugin.configureTouchHandling({ preventScrolling: true, preventZooming: false });
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.touchAction).toBe('none');

    await plugin.configureTouchHandling({ preventScrolling: false, preventZooming: false });
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.touchAction).toBe('');
  });

  it('should configure viewport zooming', async () => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(meta);

    await plugin.configureTouchHandling({ preventScrolling: false, preventZooming: true });
    
    const updatedMeta = document.querySelector('meta[name=viewport]');
    expect(updatedMeta?.getAttribute('content')).toContain('user-scalable=no');
    expect(updatedMeta?.getAttribute('content')).toContain('width=device-width');
  });
});
