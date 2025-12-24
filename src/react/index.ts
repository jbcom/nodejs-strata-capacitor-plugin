import { useEffect, useState } from 'react';
import { Strata } from '../index';
import type { DeviceInfo, SafeAreaInsets } from '../definitions';

export function useStrata() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [safeArea, setSafeArea] = useState<SafeAreaInsets | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [info, insets] = await Promise.all([
          Strata.getDeviceInfo(),
          Strata.getSafeAreaInsets(),
        ]);
        setDeviceInfo(info);
        setSafeArea(insets);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const triggerHaptic = async (type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy') => {
    try {
      await Strata.haptics({ type, style });
    } catch (err) {
      console.error('Haptics failed:', err);
    }
  };

  return {
    deviceInfo,
    safeArea,
    triggerHaptic,
    error,
    loading,
  };
}
