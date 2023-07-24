import React, {useState} from 'react';
import {View, TextInput, Image, Pressable} from 'react-native';

const ChatInput = ({classname, onSendMessage}) => {
  const [inputText, setInputText] = useState('');

  return (
    <View
      className={`flex-row items-end bg-light-base rounded-2xl border-2 border-black w-full pl-3 ${classname}`}>
      <TextInput
        className="flex-1 text-dark-dark text-s font-black"
        multiline={true}
        onChangeText={text => {
          setInputText(text);
        }}
        value={inputText}
      />
      <Pressable
        className="w-10 h-12 items-center justify-center pr-2"
        onPress={() => {
          onSendMessage(inputText);
          setInputText('');
        }}>
        <Image
          className="w-[70%] h-[50%]"
          source={require('../assets/icons/send.png')}
        />
      </Pressable>
    </View>
  );
};

export default ChatInput;
