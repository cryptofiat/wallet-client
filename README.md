# Cryptofiat wallet client

## Installation

```
npm update
npm install
npm run ionic:serve

```
## Publish Android Native

1. Increase the version number in config.xml 

2. Build APK

```
ionic run android --release
cd /platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore platforms/android/android-release.keystore android-release-unsigned.apk beta_app # password shared in slack
zipalign -v 4 android-release-unsigned.apk android-release-signed-aligned.apk
```

3. Publish in google play store
