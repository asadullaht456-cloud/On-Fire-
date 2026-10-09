#!/usr/bin/env bash
# setup.sh: On Fire Restaurant Companion, package installer
# Run once: bash setup.sh
# Versions are resolved by `npx expo install` so they always match the installed Expo SDK.
set -e

APP_NAME="onfire"

# 1. Create Expo project (TypeScript + Expo Router template)
npx create-expo-app@latest "$APP_NAME" --template default
cd "$APP_NAME"

# 2. Core navigation and platform packages
npx expo install expo-router react-native-screens react-native-safe-area-context \
  react-native-gesture-handler expo-linking expo-constants expo-status-bar

# 3. State management and persistence
npm install zustand
npx expo install @react-native-async-storage/async-storage

# 4. Animations
npx expo install react-native-reanimated react-native-worklets lottie-react-native

# 5. UI, images, icons, gradients
npx expo install expo-image expo-linear-gradient @expo/vector-icons

# 6. Fonts (Poppins headings, Inter body, Caveat tagline) and splash
npx expo install expo-font expo-splash-screen \
  @expo-google-fonts/poppins @expo-google-fonts/inter @expo-google-fonts/caveat

# 7. Special features: haptics and local notifications
npx expo install expo-haptics expo-notifications expo-device

# 8. Dev dependencies: TypeScript and unit tests (price logic)
npx expo install typescript @types/react jest jest-expo @types/jest -- --save-dev

# 9. Test script
npm pkg set scripts.test="jest"
npm pkg set jest.preset="jest-expo"

# 10. Create folder structure
mkdir -p app/\(tabs\) app/dish app/customize app/confirmation app/tracking app/order app/requests
mkdir -p components/common components/menu components/cart components/order components/kitchen
mkdir -p store theme types utils data assets/images assets/lottie __tests__

# 11. Align every package with the installed SDK and report issues
npx expo install --fix
npx expo-doctor

echo "Setup complete. Run: cd $APP_NAME && npx expo start"
