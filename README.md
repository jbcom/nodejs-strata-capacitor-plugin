# @jbcom/strata-capacitor-plugin

Capacitor plugin for [Strata 3D](https://github.com/jbcom/nodejs-strata) - cross-platform input, device detection, and haptics for mobile games.

## Status

✅ **Initial implementation complete**

## Features

- **Device Detection**: Detect mobile vs desktop and get OS details.
- **Haptic Feedback**: High-performance haptics for iOS, Android, and Web.
- **Screen Orientation**: Lock or unlock screen orientation from code.
- **Safe Area Insets**: Get accurate safe area insets for notched screens.
- **Performance Mode**: Detect battery-saving modes.
- **Touch Handling**: Unified way to disable scrolling/zooming for games.

## Installation

```bash
npm install @jbcom/strata-capacitor-plugin
npx cap sync
```

## API

### getDeviceInfo()
Returns `Promise<DeviceInfo>`.

### haptics(options: HapticsOptions)
Triggers haptic feedback.

### setScreenOrientation(options: OrientationOptions)
Sets the screen orientation.

### getSafeAreaInsets()
Returns `Promise<SafeAreaInsets>`.

### configureTouchHandling(options: TouchOptions)
Configures touch handling for webviews.

## Usage with React

```tsx
import { useStrata } from '@jbcom/strata-capacitor-plugin/react';

function MyComponent() {
  const { deviceInfo, triggerHaptic } = useStrata();
  // ...
}
```

## Related

- [@jbcom/strata](https://github.com/jbcom/nodejs-strata) - Main library
- [@jbcom/strata-react-native-plugin](https://github.com/jbcom/nodejs-strata-react-native-plugin) - React Native version
- [@jbcom/strata-examples](https://github.com/jbcom/nodejs-strata-examples) - Example applications

## License

MIT
