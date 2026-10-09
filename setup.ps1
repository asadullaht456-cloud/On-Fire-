$ErrorActionPreference = "Stop"
$APP_NAME = "onfire"

Write-Host "Creating Expo app..."
npx.cmd -y create-expo-app@latest $APP_NAME --template default

Set-Location $APP_NAME

Write-Host "Installing dependencies..."
npx.cmd expo install expo-router react-native-screens react-native-safe-area-context react-native-gesture-handler expo-linking expo-constants expo-status-bar
npm install zustand
npx.cmd expo install @react-native-async-storage/async-storage
npx.cmd expo install react-native-reanimated react-native-worklets lottie-react-native
npx.cmd expo install expo-image expo-linear-gradient @expo/vector-icons
npx.cmd expo install expo-font expo-splash-screen @expo-google-fonts/poppins @expo-google-fonts/inter @expo-google-fonts/caveat
npx.cmd expo install expo-haptics expo-notifications expo-device
npx.cmd expo install typescript @types/react jest jest-expo @types/jest -- --save-dev

Write-Host "Configuring package.json..."
npm pkg set scripts.test="jest"
npm pkg set jest.preset="jest-expo"

Write-Host "Creating directories..."
New-Item -ItemType Directory -Force -Path app\(tabs), app\dish, app\customize, app\confirmation, app\tracking, app\order, app\requests, app\login, app\signup
New-Item -ItemType Directory -Force -Path components\common, components\menu, components\cart, components\order, components\kitchen
New-Item -ItemType Directory -Force -Path store, theme, types, utils, data, assets\images, assets\lottie, __tests__

Write-Host "Fixing Expo issues and running doctor..."
npx.cmd expo install --fix
npx.cmd expo-doctor

Write-Host "Setup complete."
