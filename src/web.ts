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
    const orientation = screen.orientation as any;
    if (orientation?.lock) {
      try {
        await orientation.lock(options.orientation);
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
        if (!content.includes('user-scalable=no')) {
          viewport.setAttribute('content', `${content}, user-scalable=no`);
        }
      }
    }
  }
}
