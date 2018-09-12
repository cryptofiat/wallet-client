# Cryptofiat wallet client

## Installation

```
npm update
npm install
npm run ionic:serve

```
## Publish Android Native

1. Increase the version number in `config.xml`

2. Ask the team for `android-release.keystore` and passwords, save to `platforms/android/`

3. Build APK

```
bash android-build.bash # keystore password shared in slack #wallet-client
```

4. Publish in google play store

# Ios native test
1. `ionic state reset` is highly recommended after any codebase update
2. `ionic build ios`
3. `ionic emulate ios` or `ionic run ios`

# Web release
1. `npm run ionic:build`
2. `npm run ionic:uglifyjs`
