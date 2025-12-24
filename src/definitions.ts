
export interface StrataPlugin {
  /**
   * Get device information relevant to Strata 3D.
   */
  getDeviceInfo(): Promise<DeviceInfo>;

  /**
   * Handle haptic feedback.
   */
  haptics(options: HapticsOptions): Promise<void>;

  /**
   * Lock or unlock screen orientation.
   */
  setScreenOrientation(options: OrientationOptions): Promise<void>;

  /**
   * Get safe area insets for the device.
   */
  getSafeAreaInsets(): Promise<SafeAreaInsets>;

  /**
   * Check if performance mode is enabled or suggest it.
   */
  getPerformanceMode(): Promise<PerformanceMode>;

  /**
   * Configure touch handling for games (e.g. prevent scrolling/zooming).
   */
  configureTouchHandling(options: TouchOptions): Promise<void>;
}

export interface TouchOptions {
  preventScrolling: boolean;
  preventZooming: boolean;
}

export interface DeviceInfo {
  isMobile: boolean;
  platform: 'web' | 'ios' | 'android';
  model?: string;
  osVersion?: string;
}

export interface HapticsOptions {
  type: 'impact' | 'notification' | 'selection';
  style?: 'light' | 'medium' | 'heavy';
}

export interface OrientationOptions {
  orientation: 'any' | 'portrait' | 'landscape' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';
}

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PerformanceMode {
  enabled: boolean;
}
