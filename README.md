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
ionic cordova build android --prod --release
cd platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../android-release.keystore android-release-unsigned.apk beta_app # password shared in slack
$ANDROID_HOME/build-tools/26.0.1/zipalign -v 4 android-release-unsigned.apk android-release-signed-aligned.apk
```

4. Publish in google play store

# Ios native test
1. `ionic state reset` is highly recommended after any codebase update
2. `ionic build ios`
3. `ionic emulate ios` or `ionic run ios`

# Web release
1. `npm run ionic:build`
2. `npm run ionic:uglifyjs`


"{"encryptedChallenge":"U2FsdGVkX19rXnkvN+07/nEAkbN23c8WxHkYNpq+gWCQt0OPnXEUIjGbvPs7fDLEsK1/n8ATkTm3lokVWJnvvA==","ionic_insights_session":"\"2017-09-09T09:36:30.360Z\"","keys":"[\"U2FsdGVkX1+rTNqmmCUaxvCUL4zvLUH033OKUbwcJxokYXgfTokipGFApxZP/nNtai52IRi13Wwpe71LB+xjeujpJv5dWdAGBg/VELUv0W6lsTXb2DxUAEVYQQ5nvOhV\"]"}"

"["U2FsdGVkX1+rTNqmmCUaxvCUL4zvLUH033OKUbwcJxokYXgfTokipGFApxZP/nNtai52IRi13Wwpe71LB+xjeujpJv5dWdAGBg/VELUv0W6lsTXb2DxUAEVYQQ5nvOhV"]"


0x05bfcc7e747c687f8d19792ee1ff1c6cd467de420acdea6c4f091f922ef24711

est id 37508082241

