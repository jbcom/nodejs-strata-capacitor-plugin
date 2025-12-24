import { useEffect, useState } from 'react';
import { Strata } from '../index';
import type { DeviceInfo, SafeAreaInsets } from '../definitions';

export function useStrata() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [safeArea, setSafeArea] = useState<SafeAreaInsets | null>(null);

  useEffect(() => {
    Strata.getDeviceInfo().then(setDeviceInfo);
    Strata.getSafeAreaInsets().then(setSafeArea);
  }, []);

  const triggerHaptic = (type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy') => {
    Strata.haptics({ type, style });
  };

  return {
    deviceInfo,
    safeArea,
    triggerHaptic,
  };
}
