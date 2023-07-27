import React, {useEffect, useRef, useState} from 'react';
import {Image, SafeAreaView, StatusBar, View} from 'react-native';
import {Button, ChatView, ChatInput} from '../components';
import {API, StorageService} from '../services';
import {Languages} from '../consts';
import {REWARDED_INTERSTITIAL_ID} from '@env';
import mobileAds, {
  MaxAdContentRating,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const Chat = ({navigation, translate}) => {
  const [assistantID, setAssistantID] = useState(undefined);
  const [chat, setChat] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  const isInitialMount = useRef(true);

  const adUnitId = __DEV__
    ? TestIds.REWARDED_INTERSTITIAL
    : REWARDED_INTERSTITIAL_ID;

  const adConfig = {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['interior design', 'clothing', 'fashion'],
  };

  const viewAd = RewardedInterstitialAd.createForAdRequest(adUnitId, adConfig);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('language').then(lang =>
        StorageService.load('assistant_id').then(id => setAssistant(id, lang)),
      );

      mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: ['EMULATOR'],
      });
      mobileAds().initialize();
    }
  });

  useEffect(() => {
    const unsubscribeLoaded = viewAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setIsAdLoaded(true),
    );
    const unsubscribeEarned = viewAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => StorageService.save('view_count', reward.amount.toString()),
    );

    viewAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  });

  const setAssistant = (id, language) => {
    if (id === undefined) {
      API.createAssistant(Languages.getLanguageByCode(language).name)
        .then(({response}) => {
          StorageService.save('view_count', '0');
          StorageService.save('assistant_id', response.toString());
          setAssistantID(response.toString());
        })
        .catch(error => {
          console.error('createAssistant: ', error);
        });
    } else {
      setAssistantID(id);
      API.getMemory(id)
        .then(({response}) => setChat(response))
        .catch(error => {
          console.error('getMemory: ', error);
        });
    }
  };

  const onSendMessage = message => {
    chat.push({role: 'user', content: message});
    setIsThinking(true);
    API.ask(message, assistantID).then(({response}) => {
      chat.push({role: 'assistant', content: response});
      setChat(chat);
      setIsThinking(false);
    });
  };

  const onView = () => {
    StorageService.load('view_count').then(count => {
      if (parseInt(count, 10) <= 0) {
        if (isAdLoaded) {
          viewAd.show();
          viewDesign();
        } else {
          console.warn('Not loaded');
        }
      } else {
        viewDesign();
      }
    });
  };

  const viewDesign = () =>
    API.view(assistantID)
      .then(({response}) => {
        StorageService.save('image_url', response);
        navigation.push('design_view');
      })
      .catch(e => {
        console.warn(e);
        viewDesign();
      });

  return (
    <SafeAreaView className="items-center h-full w-full bg-base justify-between p-8">
      <StatusBar hidden />
      <ChatView
        translate={translate}
        messages={chat}
        isThinking={isThinking}
        classname="flex-1"
      />
      <View className="flex justify-end w-full">
        <View className="flex flex-row justify-between w-full items-center pr-8">
          <Image
            className="w-32 h-32"
            source={require('../assets/avatars/avatar1.png')}
          />
          <Button
            classname="rounded-full h-10 w-28"
            textClassName="text-xl"
            onPress={onView}
            text={translate('view')}
          />
        </View>
        <ChatInput classname="" onSendMessage={onSendMessage} />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
