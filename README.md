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
cd platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../android-release.keystore android-release-unsigned.apk beta_app # password shared in slack
$ANDROID_HOME/build-tools/25.0.1/zipalign -v 4 android-release-unsigned.apk android-release-signed-aligned.apk
```

Publish in google play store
