#!/bin/bash


ionic cordova build android --prod --release
export APK_PATH=./platforms/android/app/build/outputs/apk/release/
#ls -la $APK_PATH
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./android-release.keystore $APK_PATH/app-release-unsigned.apk beta_app
 # password shared in slack
$ANDROID_HOME/build-tools/26.0.3/zipalign -v 4 $APK_PATH/app-release-unsigned.apk $APK_PATH/app-release-signed-aligned.apk
