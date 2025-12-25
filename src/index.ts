import { registerPlugin } from '@capacitor/core';
import type { StrataPlugin } from './definitions';

const Strata = registerPlugin<StrataPlugin>('Strata', {
  web: () => import('./web').then(m => new m.StrataWeb()),
});

export const version = '0.0.1';
export function hello() {
  return 'Hello from Strata Capacitor Plugin';
}

export * from './definitions';
export { Strata };
