import React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import Triangle from './Triangle';

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

const ChatItem = ({chatObject, onSelectMessage}) => (
  <Pressable onPress={onSelectMessage}>
    <Text className="text-dark-dark w-full text-xl font-black">
      {capitalize(chatObject)}
    </Text>
  </Pressable>
);

const ChatView = ({classname}) => (
  <View className={`w-full pb-12 ${classname}`}>
    <Triangle
      classname="absolute bottom-0 left-20 rotate-45 border-t-[100px] border-x-[40px]"
      color="#E0EDFF"
    />
    <View className="bg-light-base rounded-3xl items-center w-full h-full mb-16 p-3">
      <View className="h-full w-full">
        <FlatList
          data={['hola como estas?']}
          renderItem={({item}) => (
            <ChatItem
              chatObject={item}
              onSelectMessage={() => console.log('TODO')}
            />
          )}
        />
      </View>
    </View>
  </View>
);

export default ChatView;
export {ChatItem};
