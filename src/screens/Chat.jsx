import React, {useEffect, useRef, useState} from 'react';
import {Image, SafeAreaView, StatusBar, View} from 'react-native';
import {Button, ChatView, ChatInput, LoadingModal} from '../components';
import {API, StorageService} from '../services';
import {Languages} from '../consts';
import {REWARDED_INTERSTITIAL_ID, INTERSTITIAL_ID} from '@env';
import mobileAds, {
  AdEventType,
  InterstitialAd,
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
  const [isChatAdLoaded, setIsChatAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState('0');

  const isInitialMount = useRef(true);

  const chatAdFreq = 5;

  const adConfig = {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['interior design', 'clothing', 'fashion'],
  };

  const viewAd = RewardedInterstitialAd.createForAdRequest(
    __DEV__ ? TestIds.REWARDED_INTERSTITIAL : REWARDED_INTERSTITIAL_ID,
    adConfig,
  );
  const chatAd = InterstitialAd.createForAdRequest(
    __DEV__ ? TestIds.INTERSTITIAL : INTERSTITIAL_ID,
    adConfig,
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      // StorageService.save('view_count', '0');
      StorageService.load('view_count').then(view_count =>
        setCount(view_count),
      );
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
    viewAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      setCount(reward.amount.toString());
      StorageService.save('view_count', reward.amount.toString());
    });
    const unsubscribeChatLoaded = chatAd.addAdEventListener(
      AdEventType.LOADED,
      () => setIsChatAdLoaded(true),
    );

    chatAd.load();

    viewAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeChatLoaded();
    };
  });

  const setAssistant = (id, language) => {
    if (id === undefined) {
      API.createAssistant(Languages.getLanguageByCode(language).name)
        .then(({response}) => {
          StorageService.save('view_count', '0');
          StorageService.save('assistant_id', response.toString());
          setCount('0');
          setAssistantID(response.toString());
        })
        .catch(error => {
          console.error('createAssistant: ', error);
        });
    } else {
      setAssistantID(id);
      API.getMemory(id)
        .then(({status, response}) => {
          if (status === 200) {
            setChat(response);
          } else if (status === 409) {
            setAssistant(undefined, language);
          }
        })
        .catch(error => {
          console.error('getMemory: ', error);
        });
    }
  };

  const onSendMessage = message => {
    if (isChatAdLoaded) {
      if (chat.length % chatAdFreq === 0) {
        chatAd.show();
      }
    }
    chat.push({role: 'user', content: message});
    setIsThinking(true);
    API.ask(message, assistantID).then(({response}) => {
      chat.push({role: 'assistant', content: response});
      setChat(chat);
      setIsThinking(false);
    });
  };

  const onView = () =>
    StorageService.load('view_count').then(view_count => {
      setIsLoading(true);
      if (parseInt(view_count, 10) <= 0) {
        if (isAdLoaded) {
          viewAd.show();
          viewDesign();
        } else {
          console.warn('Not loaded');
          setIsLoading(false);
        }
      } else {
        viewDesign();
      }
    });

  const viewDesign = () =>
    API.view(assistantID)
      .then(({response}) => {
        StorageService.save('image_url', response);
        setIsLoading(false);
        navigation.push('design_view');
      })
      .catch(e => {
        console.warn(e);
        viewDesign();
      });

  return (
    <SafeAreaView>
      <View className="items-center h-full w-full bg-base justify-between p-8">
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
            {isAdLoaded || parseInt(count, 10) > 0 ? (
              <Button
                classname="rounded-full h-10 w-28"
                textClassName="text-xl"
                onPress={onView}
                text={translate('view')}
              />
            ) : null}
          </View>
          <ChatInput classname="" onSendMessage={onSendMessage} />
        </View>
      </View>
      <LoadingModal isVisible={isLoading} />
    </SafeAreaView>
  );
};

export default Chat;
