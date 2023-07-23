import React from 'react';
import {Image, View} from 'react-native';
import {Button, ChatView, TextInput} from '../components';

const Chat = ({translate}) => {
  return (
    <View className="items-center h-full w-full justify-between p-8">
      <ChatView classname="flex-1" />
      <View className="flex align-baseline w-full h-44">
        <View className="flex flex-row justify-between w-full items-center pr-8">
          <Image
            className="w-32 h-32"
            source={require('../assets/avatars/avatar1.png')}
          />
          <Button
            classname="rounded-full h-10 w-28"
            textClassName="text-xl"
            text={translate('view')}
          />
        </View>
        <TextInput classname="" />
      </View>
    </View>
  );
};

export default Chat;
