import { WebPlugin } from '@capacitor/core';

import type { DeviceInfo, HapticsOptions, OrientationOptions, PerformanceMode, SafeAreaInsets, StrataPlugin, TouchOptions } from './definitions';

export class StrataWeb extends WebPlugin implements StrataPlugin {
  async getDeviceInfo(): Promise<DeviceInfo> {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return {
      isMobile,
      platform: 'web',
    };
  }

  async haptics(options: HapticsOptions): Promise<void> {
    if ('vibrate' in navigator) {
      if (options.type === 'impact') {
        const duration = options.style === 'heavy' ? 100 : options.style === 'medium' ? 50 : 20;
        navigator.vibrate(duration);
      } else if (options.type === 'notification') {
        navigator.vibrate([100, 30, 100]);
      } else if (options.type === 'selection') {
        navigator.vibrate(10);
      }
    }
  }

  async setScreenOrientation(options: OrientationOptions): Promise<void> {
    if (screen.orientation && 'lock' in screen.orientation) {
      try {
        await (screen.orientation as unknown as { lock: (orientation: string) => Promise<void> }).lock(options.orientation);
      } catch (e) {
        console.warn('Orientation lock failed:', e);
      }
    }
  }

  async getSafeAreaInsets(): Promise<SafeAreaInsets> {
    // In web, we usually don't have safe area insets unless specified by CSS environment variables
    // But we can return 0s as default
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }

  async getPerformanceMode(): Promise<PerformanceMode> {
    return {
      enabled: false,
    };
  }

  async configureTouchHandling(options: TouchOptions): Promise<void> {
    if (options.preventScrolling) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    if (options.preventZooming) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        const content = viewport.getAttribute('content') || '';
        const parts = content.split(',').map(p => p.trim()).filter(p => p !== '');
        if (!parts.some(p => p.startsWith('user-scalable='))) {
          parts.push('user-scalable=no');
          viewport.setAttribute('content', parts.join(', '));
        }
      }
    }
  }
}
