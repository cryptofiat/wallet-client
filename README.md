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
ionic build android --release
cd platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../android-release.keystore android-release-unsigned.apk beta_app # password shared in slack
$ANDROID_HOME/build-tools/25.0.1/zipalign -v 4 android-release-unsigned.apk android-release-signed-aligned.apk
```

4. Publish in google play store

# Ios native test
1. `ionic state reset` is highly recommended after any codebase update
2. `ionic build ios`
3. `ionic emulate ios` or `ionic run ios`

# Web release
1. `ionic build --minify`
2. `npm run ionic:uglifyjs`
