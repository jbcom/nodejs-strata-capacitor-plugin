# @strata/capacitor-plugin

[![npm version](https://img.shields.io/npm/v/@strata/capacitor-plugin.svg)](https://www.npmjs.com/package/@strata/capacitor-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🏢 Enterprise Context

**Strata** is the Games & Procedural division of the [jbcom enterprise](https://jbcom.github.io). This plugin is part of a coherent suite of specialized tools, sharing a unified design system and interconnected with sibling organizations like [Agentic](https://agentic.dev) and [Extended Data](https://extendeddata.dev).

Cross-platform input, device detection, and haptics for [Strata 3D](https://strata.game) games. Works with Capacitor for iOS/Android native apps, Electron for desktop, and pure web.

## Features

- **Device Detection** - Automatically detect platform (iOS, Android, Windows, macOS, Linux, Web), device type (mobile, tablet, foldable, desktop), and input mode (touch, keyboard, gamepad)
- **Unified Input** - Abstract touch joysticks, keyboard WASD, and gamepad sticks into a single API
- **Haptic Feedback** - Unified haptics via device vibration and gamepad rumble
- **Screen Orientation** - Lock or unlock screen orientation from code
- **Safe Area Insets** - Get accurate safe area insets for notched screens
- **Performance Mode** - Detect battery-saving modes
- **Touch Handling** - Unified way to disable scrolling/zooming for games
- **React Hooks** - Ready-to-use hooks for React/React Three Fiber integration

## Installation

```bash
pnpm install @strata/capacitor-plugin
npx cap sync
```

## Usage

### Core API

```typescript
import { Strata } from '@strata/capacitor-plugin';

// Get device profile
const profile = await Strata.getDeviceProfile();
console.log(profile.deviceType); // 'mobile' | 'tablet' | 'foldable' | 'desktop'
console.log(profile.inputMode);  // 'touch' | 'keyboard' | 'gamepad' | 'hybrid'

// Get context-aware control hints
const hints = await Strata.getControlHints();
console.log(hints.movement); // "Drag to move" or "WASD to move" depending on device

// Get current input state
const input = await Strata.getInputSnapshot();
console.log(input.leftStick); // { x: 0, y: -1 } for forward movement

// Trigger haptic feedback
await Strata.triggerHaptics({ intensity: 'medium' });

// Configure touch handling (Web only)
await Strata.configureTouchHandling({ preventScrolling: true, preventZooming: true });
```

### React Hooks

```tsx
import { DeviceProvider, useDevice, useInput, useHaptics, useControlHints, useStrata } from '@strata/capacitor-plugin/react';

function App() {
  return (
    <DeviceProvider>
      <Game />
    </DeviceProvider>
  );
}

function Game() {
  const device = useDevice();
  const { leftStick, isPressed } = useInput();
  const { medium } = useHaptics();
  const hints = useControlHints();
  const { deviceInfo, safeArea } = useStrata();

  // Show appropriate controls based on device
  if (device.inputMode === 'touch') {
    return <TouchControls hint={hints.movement} />;
  }
  
  return <KeyboardControls hint={hints.movement} />;
}
```

## API Reference

### DeviceProfile

| Property | Type | Description |
|----------|------|-------------|
| `deviceType` | `'mobile' | 'tablet' | 'foldable' | 'desktop'` | Detected device category |
| `platform` | `'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'web'` | Operating system |
| `inputMode` | `'touch' | 'keyboard' | 'gamepad' | 'hybrid'` | Primary input method |
| `orientation` | `'portrait' | 'landscape'` | Screen orientation |
| `hasTouch` | `boolean` | Touch capability |
| `hasPointer` | `boolean` | Precise pointer (mouse) |
| `hasGamepad` | `boolean` | Connected gamepad |
| `screenWidth` | `number` | Viewport width |
| `screenHeight` | `number` | Viewport height |
| `pixelRatio` | `number` | Device pixel ratio |
| `safeAreaInsets` | `{ top: number, right: number, bottom: number, left: number }` | Safe area for notches/home indicators |

### InputSnapshot

| Property | Type | Description |
|----------|------|-------------|
| `leftStick` | `{ x: number, y: number }` | Movement input (-1 to 1) |
| `rightStick` | `{ x: number, y: number }` | Camera/look input (-1 to 1) |
| `buttons` | `Record<string, boolean>` | Button states |
| `triggers` | `{ left: number, right: number }` | Trigger values (0 to 1) |
| `touches` | `Array<{ id: number, position: { x: number, y: number }, phase: 'began' | 'moved' | 'ended' | 'cancelled' }>` | Active touch points |

### HapticsOptions

| Property | Type | Description |
|----------|------|-------------|
| `intensity` | `'light' | 'medium' | 'heavy'` | Vibration strength preset |
| `customIntensity` | `number?` | Custom intensity from 0.0 to 1.0 (overrides `intensity`) |
| `duration` | `number?` | Duration in milliseconds |
| `pattern` | `number[]?` | Vibration pattern array (alternating on/off durations in ms) |

## Platform Support

| Feature | Web | iOS | Android | Electron |
|---------|-----|-----|---------|----------|
| Device Detection | ✅ | ✅ | ✅ | ✅ |
| Touch Input | ✅ | ✅ | ✅ | ✅ |
| Keyboard Input | ✅ | ⚠️ | ⚠️ | ✅ |
| Gamepad Input | ✅ | ⚠️ | ⚠️ | ✅ |
| Device Haptics | ⚠️ | ✅ | ✅ | ❌ |
| Gamepad Haptics | ✅ | ❌ | ❌ | ✅ |

✅ Full support | ⚠️ Partial support | ❌ Not supported

### Platform Notes

- **Keyboard/Gamepad on Mobile (iOS/Android)**: ⚠️ Partial support refers to the fact that these inputs are supported via physical external peripherals connected via Bluetooth or USB. Support for soft-keyboards is not the primary focus.
- **Device Haptics on Web**: ⚠️ Supported on Android Chrome and some other mobile browsers. Not supported on iOS Safari.
- **Gamepad Haptics on iOS/Android**: ⚠️ Native rumble for connected controllers is planned for a future update.

## License

MIT

