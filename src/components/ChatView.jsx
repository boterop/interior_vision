import React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import Triangle from './Triangle';

const SYSTEM_ROLE = 'system';
const USER_ROLE = 'user';

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

const ChatItem = ({chatObject, onSelectMessage}) => (
  <Pressable className="mb-5" onPress={onSelectMessage}>
    <Text
      className={`text-dark-dark w-full text-xl font-black ${
        chatObject.role === USER_ROLE ? 'text-right' : ''
      }`}>
      {capitalize(chatObject.content)}
    </Text>
  </Pressable>
);

const ChatView = ({classname}) => (
  <View className={`w-full pb-12 ${classname}`}>
    <Triangle
      classname="absolute bottom-0 left-20 rotate-45 border-t-[100px] border-x-[40px]"
      color="light-base"
    />
    <View className="bg-light-base rounded-3xl items-center w-full h-full mb-16 p-3 pt-5">
      <View className="h-full w-full">
        <FlatList
          data={[
            {role: 'system', content: 'You are a helpful assistant.'},
            {role: 'user', content: 'Who won the world series in 2020?'},
            {
              role: 'assistant',
              content: 'The Los Angeles Dodgers won the World Series in 2020.',
            },
            {role: 'user', content: 'Where was it played?'},
          ]}
          renderItem={({item}) => {
            if (item.role !== SYSTEM_ROLE)
              return (
                <ChatItem
                  chatObject={item}
                  onSelectMessage={() => console.log('TODO')}
                />
              );
          }}
        />
      </View>
    </View>
  </View>
);

export default ChatView;
export {ChatItem};
