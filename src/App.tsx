import React, {useEffect, useRef, useState} from 'react';
import {Chat, DesignView, LanguageSelector} from './screens';
import {useTranslation} from 'react-i18next';
import {StorageService} from './services';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import './lang/i18n';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Consts} from './consts';
import {REWARDED_INTERSTITIAL_ID, INTERSTITIAL_ID} from '@env';
import mobileAds, {
  AdEventType,
  InterstitialAd,
  MaxAdContentRating,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const App = () => {
  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState('en');
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isChatAdLoaded, setIsChatAdLoaded] = useState(false);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('language').then(lang => onChangeLanguage(lang));

      permissions();

      mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: ['EMULATOR'],
      });
      mobileAds().initialize();
    }
  });

  const loadViewAd = (setCount: (arg0: string) => void) => {
    const unsubscribeLoaded = viewAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setIsAdLoaded(true),
    );
    viewAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      StorageService.save('view_count', reward.amount.toString());
      if (setCount !== undefined) {
        setCount(reward.amount.toString());
      }
      showAd(1);
    });

    viewAd.load();

    return () => unsubscribeLoaded();
  };

  const loadChatAd = () => {
    const unsubscribeChatLoaded = chatAd.addAdEventListener(
      AdEventType.LOADED,
      () => setIsChatAdLoaded(true),
    );

    chatAd.load();

    return () => unsubscribeChatLoaded();
  };

  const viewAd = RewardedInterstitialAd.createForAdRequest(
    __DEV__ ? TestIds.REWARDED_INTERSTITIAL : REWARDED_INTERSTITIAL_ID,
    Consts.AD_PREFERENCES,
  );
  const chatAd = InterstitialAd.createForAdRequest(
    __DEV__ ? TestIds.INTERSTITIAL : INTERSTITIAL_ID,
    Consts.AD_PREFERENCES,
  );

  const showAd = (adID = 0) => {
    try {
      if (adID === 0 && isAdLoaded) {
        viewAd.show();
        return true;
      } else if (adID === 1 && isChatAdLoaded) {
        chatAd.show();
        return true;
      }

      return false;
    } catch (e) {
      console.warn(`Error showing ad with id ${adID}`);
      if (adID === 0) {
        StorageService.save('view_count', '1');
      }
      return false;
    }
  };

  const {Screen, Navigator} = createNativeStackNavigator();

  const permissions = async () => {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }
  };

  const onChangeLanguage = (value: string | undefined) =>
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value ? value : 'en'))
      .catch(err => console.error(err));

  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="language_selector"
        screenOptions={{
          headerShown: false,
        }}>
        <Screen name="language_selector">
          {props => (
            <LanguageSelector
              {...props}
              translate={t}
              currentLanguage={currentLanguage}
              onChangeLanguage={onChangeLanguage}
            />
          )}
        </Screen>
        <Screen name="chat">
          {props => (
            <Chat
              {...props}
              translate={t}
              showAd={showAd}
              loadAd={{chat: loadChatAd, view: loadViewAd}}
            />
          )}
        </Screen>
        <Screen name="design_view">
          {props => (
            <DesignView
              {...props}
              translate={t}
              showAd={showAd}
              loadAd={{chat: loadChatAd, view: loadViewAd}}
            />
          )}
        </Screen>
      </Navigator>
    </NavigationContainer>
  );
};

export default App;
