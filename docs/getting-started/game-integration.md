# Integrating Strata Capacitor Plugin

This guide shows how to integrate the Strata Capacitor Plugin into your game for cross-platform input, device detection, haptics, and persistent storage.

## Installation

```bash
pnpm add @strata/capacitor-plugin
```

## Quick Start

### Basic Usage

```typescript
import { Strata } from '@strata/capacitor-plugin';

// Get device profile
const profile = await Strata.getDeviceProfile();
console.log(`Running on ${profile.platform}, input mode: ${profile.inputMode}`);

// Get input state
const input = await Strata.getInputSnapshot();
if (input.buttons.jump) {
  player.jump();
}

// Trigger haptic feedback
await Strata.triggerHaptics({ intensity: 'medium' });

// Save game progress
await Strata.setItem('progress', { level: 5, score: 1000 }, { namespace: 'mygame' });

// Load game progress
const { value } = await Strata.getItem('progress', { namespace: 'mygame' });
```

### React Hooks

```tsx
import { 
  useDevice, 
  useInput, 
  useHaptics, 
  useStorage,
  DeviceProvider,
  InputProvider 
} from '@strata/capacitor-plugin/react';

function Game() {
  return (
    <DeviceProvider>
      <InputProvider>
        <GameContent />
      </InputProvider>
    </DeviceProvider>
  );
}

function GameContent() {
  const { profile } = useDevice();
  const { input } = useInput();
  const { trigger } = useHaptics();
  const { saveGame, loadGame } = useStorage('mygame');

  // Use profile.isMobile to adapt UI
  // Use input.leftStick for movement
  // Call trigger({ intensity: 'heavy' }) on impacts
  // Call saveGame('slot1', gameState) to persist progress
}
```

## Storage API

The plugin provides a namespace-aware storage API that works on web (localStorage) and native platforms.

### Saving Data

```typescript
// Save with default namespace ('strata')
await Strata.setItem('settings', { volume: 0.8, music: true });

// Save with custom namespace (recommended for games)
await Strata.setItem('progress', { level: 5 }, { namespace: 'mygame' });
// Stored as: localStorage['mygame:progress']
```

### Loading Data

```typescript
const { value, exists } = await Strata.getItem<GameProgress>('progress', { 
  namespace: 'mygame' 
});

if (exists && value) {
  resumeGame(value.level);
} else {
  startNewGame();
}
```

### Managing Saves

```typescript
// List all save keys
const { keys } = await Strata.keys({ namespace: 'mygame' });
// keys: ['progress', 'settings', 'slot1', 'slot2']

// Delete a specific save
await Strata.removeItem('slot1', { namespace: 'mygame' });

// Clear all game data
await Strata.clear({ namespace: 'mygame' });
```

### React Storage Hook

```tsx
function SaveLoadMenu() {
  const { saveGame, loadGame, listSaves, deleteGame, loading, error } = useStorage('mygame');

  const handleSave = async () => {
    await saveGame('quicksave', getCurrentGameState());
  };

  const handleLoad = async () => {
    const { value } = await loadGame<GameState>('quicksave');
    if (value) restoreGameState(value);
  };

  const handleShowSlots = async () => {
    const saves = await listSaves();
    // Display save slots to user
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <button onClick={handleSave}>Quick Save</button>
      <button onClick={handleLoad}>Quick Load</button>
    </div>
  );
}
```

## GitHub Pages Deployment

Use the reusable workflow to standardize deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    uses: strata-game-library/capacitor-plugin/.github/workflows/reusable-deploy-pages.yml@main
    with:
      package-manager: 'pnpm'
      build-command: 'pnpm build'
      dist-path: './dist'
```

Or manually configure Vite for GitHub Pages:

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  // ... rest of config
});
```

And set the environment variable in your workflow:

```yaml
- name: Build
  run: pnpm build
  env:
    VITE_BASE_URL: /${{ github.event.repository.name }}/
```

## Input Handling

### Keyboard + Gamepad

```typescript
// Subscribe to input changes
await Strata.addListener('inputChange', (snapshot) => {
  // Movement from either keyboard WASD or gamepad left stick
  player.move(snapshot.leftStick.x, snapshot.leftStick.y);
  
  // Action from either keyboard E/Enter or gamepad A button
  if (snapshot.buttons.action) {
    player.interact();
  }
});
```

### Custom Key Mappings

```typescript
await Strata.setInputMapping({
  moveForward: ['KeyW', 'ArrowUp'],
  moveBackward: ['KeyS', 'ArrowDown'],
  jump: ['Space', 'KeyJ'],
  action: ['KeyE', 'Enter', 'KeyK'],
});
```

## Device Adaptation

```tsx
function AdaptiveUI() {
  const { profile } = useDevice();

  if (profile.isMobile) {
    return <TouchControls />;
  }

  if (profile.hasGamepad) {
    return <GamepadPrompts />;
  }

  return <KeyboardPrompts />;
}
```

## Haptic Feedback

```typescript
// Preset intensities
await Strata.triggerHaptics({ intensity: 'light' });   // UI feedback
await Strata.triggerHaptics({ intensity: 'medium' });  // Collisions
await Strata.triggerHaptics({ intensity: 'heavy' });   // Explosions

// Custom intensity (0-1)
await Strata.triggerHaptics({ customIntensity: 0.7, duration: 50 });

// Pattern (web/Android)
await Strata.triggerHaptics({ pattern: [100, 50, 100, 50, 200] });
```

## TypeScript Types

All types are exported for full type safety:

```typescript
import type {
  DeviceProfile,
  InputSnapshot,
  InputMapping,
  HapticsOptions,
  StorageOptions,
  StorageResult,
} from '@strata/capacitor-plugin';
```
