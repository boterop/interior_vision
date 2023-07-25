import React, {useEffect, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {Button, ChatView, ChatInput} from '../components';
import {API, StorageService} from '../services';
import {Languages} from '../consts';
import {REWARDED_INTERSTITIAL_ID} from '@env';
import mobileAds, {
  MaxAdContentRating,
  TestIds,
  useRewardedAd,
} from 'react-native-google-mobile-ads';

const Chat = ({translate, language}) => {
  const [assistantID, setAssistantID] = useState(undefined);
  const [chat, setChat] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const isInitialMount = useRef(true);
  const {isLoaded, isClosed, load, show} = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : REWARDED_INTERSTITIAL_ID,
    adConfig,
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('assistant_id').then(setAssistant);

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
    load();
    if (isClosed && imageUrl !== '') {
      // TODO show image
    }
  }, [isClosed]);

  const adConfig = {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['interior design', 'clothing', 'fashion'],
  };

  const setAssistant = id => {
    if (id === undefined) {
      API.createAssistant(Languages.getLanguageByCode(language).name)
        .then(({response}) => {
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
    if (isLoaded) {
      show();
      API.view(assistantID).then(({response}) => {
        setImageUrl(response);
      });
    } else {
      console.warn('Not loaded');
    }
  };

  return (
    <View className="items-center h-full w-full justify-between p-8">
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
    </View>
  );
};

export default Chat;
