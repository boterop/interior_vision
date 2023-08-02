import React, {useEffect, useRef, useState} from 'react';
import {Image, Keyboard, SafeAreaView, StatusBar, View} from 'react-native';
import {Button, ChatView, ChatInput, LoadingModal} from '../components';
import {API, StorageService} from '../services';
import {Consts, Languages} from '../consts';

const Chat = ({navigation, translate, showAd, loadAd}) => {
  const [assistantID, setAssistantID] = useState(undefined);
  const [chat, setChat] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewDesign, setHasNewDesign] = useState(false);
  const [count, setCount] = useState('0');

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      // saveViewCount('0');
      // StorageService.save('assistant_id', '1')
      StorageService.load('view_count').then(view_count =>
        setCount(view_count),
      );
      StorageService.load('language').then(lang =>
        StorageService.load('assistant_id').then(id => setAssistant(id, lang)),
      );
    }
  });

  useEffect(() => {
    if (parseInt(count, 10) > 0 && hasNewDesign) {
      setHasNewDesign(false);
      navigation.push('design_view');
    }
  }, [count, hasNewDesign, navigation]);

  useEffect(() => loadAd.chat());
  useEffect(() => loadAd.view(setCount));

  const saveViewCount = amount => {
    setCount(amount);
    StorageService.save('view_count', amount.toString());
  };

  const setAssistant = (id, language) => {
    if (id === undefined) {
      API.createAssistant(Languages.getLanguageByCode(language).name)
        .then(({response}) => {
          saveViewCount('0');
          StorageService.save('assistant_id', response.toString());
          setAssistantID(response.toString());
          setAssistant(response.toString(), language);
        })
        .catch(error => {
          console.error('createAssistant: ', error);
        });
    } else {
      setAssistantID(id);
      API.getMemory(id)
        .then(({status, response}) => {
          if (status === 200) {
            if (response.length <= 3) {
              response.push({role: 'assistant', content: translate('hi')});
            }
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
    if (message.length === 0) {
      return;
    }
    if (chat.length % Consts.CHAT_AD_FREQ === 0) {
      showAd(1);
    }
    chat.push({role: 'user', content: message});
    setIsThinking(true);
    API.ask(message, assistantID)
      .then(({response, status}) => {
        if (status === 409) {
          chat.push({
            role: 'assistant',
            content: translate('max_length_reached'),
          });
        } else {
          chat.push({role: 'assistant', content: response});
        }
        setChat(chat);
        setIsThinking(false);
      })
      .catch(() => {
        setIsThinking(false);
        chat.push({
          role: 'assistant',
          content: translate('not_available'),
        });
      });
  };

  const onReset = () =>
    StorageService.load('language').then(lang =>
      API.cleanMemory(assistantID, lang).then(() => setAssistant(assistantID)),
    );

  const onView = () => {
    Keyboard.dismiss();
    if (chat.length < 5) {
      showAd(1);
      return;
    }
    setIsLoading(true);
    StorageService.load('view_count').then(view_count => {
      if (parseInt(view_count, 10) > 0) {
        viewDesign();
      } else if (showAd()) {
        viewDesign();
      } else if (showAd(1)) {
        saveViewCount('1');
        viewDesign();
      } else {
        console.warn('Not loaded');
        chat.push({
          role: 'assistant',
          content: translate('not_available'),
        });
        setIsLoading(false);
      }
    });
  };

  const viewDesign = (attempts = 0) =>
    API.view(assistantID)
      .then(({response, status}) => {
        if (status === 200) {
          StorageService.save('image_url', response);
          setHasNewDesign(true);
        } else if (status === 409) {
          chat.push({
            role: 'assistant',
            content: translate('max_length_reached'),
          });
        }

        setIsLoading(false);
      })
      .catch(e => {
        console.warn(e);
        if (attempts < Consts.MAX_ATTEMPTS) {
          viewDesign(attempts + 1);
        } else {
          setIsLoading(false);
          chat.push({
            role: 'assistant',
            content: translate('not_available'),
          });
        }
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
            <View>
              {chat.length > 4 ? (
                <Button
                  classname="rounded-full h-8 w-28 mb-5 bg-base"
                  textClassName="text-xl text-dark-dark"
                  onPress={onReset}
                  text={translate('reset')}
                />
              ) : null}
              <Button
                classname="rounded-full h-10 w-28"
                textClassName="text-xl"
                onPress={onView}
                text={translate('view')}
              />
            </View>
          </View>
          <ChatInput classname="" onSendMessage={onSendMessage} />
        </View>
      </View>
      <LoadingModal isVisible={isLoading} />
    </SafeAreaView>
  );
};

export default Chat;
