react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
rm -Rf ./android/app/src/main/res/drawable-*
sleep 5
cd android
KEY_PASS=$RELEASE_KEY ./gradlew bundleRelease
