import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Use vi.hoisted for variables used in vi.mock
const { mockPlugin } = vi.hoisted(() => ({
  mockPlugin: {
    getDeviceProfile: vi.fn(),
    getControlHints: vi.fn(),
    getInputSnapshot: vi.fn(),
    triggerHaptics: vi.fn(),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
  }
}));

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock the Strata object directly
vi.mock('../../src', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual as any,
    Strata: mockPlugin,
  };
});

// Import hooks and providers
import { useDevice, useHaptics, useInput, DeviceProvider, InputProvider } from '../../src/react';

describe('Strata Capacitor Plugin Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlugin.addListener.mockResolvedValue({ remove: vi.fn() });
    mockPlugin.getDeviceProfile.mockResolvedValue({
      deviceType: 'desktop',
      platform: 'web',
      inputMode: 'keyboard',
    });
  });

  describe('Device Detection', () => {
    it('should detect iOS platform and device type', async () => {
      const iosProfile = {
        deviceType: 'mobile',
        platform: 'ios',
        inputMode: 'touch',
        orientation: 'portrait',
        hasTouch: true,
        hasPointer: false,
        hasGamepad: false,
        isMobile: true,
        isTablet: false,
        isFoldable: false,
        isDesktop: false,
        screenWidth: 390,
        screenHeight: 844,
        pixelRatio: 3,
        safeAreaInsets: { top: 47, right: 0, bottom: 34, left: 0 }
      } as any;

      mockPlugin.getDeviceProfile.mockResolvedValue(iosProfile);

      const { result } = renderHook(() => useDevice(), {
        wrapper: ({ children }) => React.createElement(DeviceProvider, null, children)
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(result.current).toEqual(iosProfile);
    });

    it('should detect Android platform and device type', async () => {
      const androidProfile = {
        deviceType: 'tablet',
        platform: 'android',
        inputMode: 'hybrid',
        orientation: 'landscape',
        hasTouch: true,
        hasPointer: false,
        hasGamepad: true,
        isMobile: false,
        isTablet: true,
        isFoldable: false,
        isDesktop: false,
        screenWidth: 1280,
        screenHeight: 800,
        pixelRatio: 2,
        safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 }
      } as any;

      mockPlugin.getDeviceProfile.mockResolvedValue(androidProfile);

      const { result } = renderHook(() => useDevice(), {
        wrapper: ({ children }) => React.createElement(DeviceProvider, null, children)
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(result.current).toEqual(androidProfile);
    });
  });

  describe('Haptics API', () => {
    it('should trigger light haptics', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.light();
      });

      expect(mockPlugin.triggerHaptics).toHaveBeenCalledWith({ intensity: 'light' });
    });

    it('should trigger custom vibration', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.vibrate(100);
      });

      expect(mockPlugin.triggerHaptics).toHaveBeenCalledWith({ duration: 100 });
    });
  });

  describe('Input Handling', () => {
    it('should receive gamepad input snapshots via listener', async () => {
      const mockSnapshot = {
        timestamp: 123456789,
        leftStick: { x: 0.5, y: -0.5 },
        rightStick: { x: 0, y: 0 },
        buttons: { jump: true, action: false, cancel: false },
        triggers: { left: 0, right: 0.8 },
        touches: []
      } as any;

      let inputListener: any;
      mockPlugin.addListener.mockImplementation((name, cb) => {
        if (name === 'inputChange') {
          inputListener = cb;
        }
        return Promise.resolve({ remove: vi.fn() });
      });

      const { result } = renderHook(() => useInput(), {
        wrapper: ({ children }) => React.createElement(InputProvider, null, children)
      });

      await act(async () => {
        if (inputListener) {
          inputListener(mockSnapshot);
        }
      });

      expect(result.current.snapshot).toEqual(mockSnapshot);
      expect(result.current.isPressed('jump')).toBe(true);
    });
  });
});
