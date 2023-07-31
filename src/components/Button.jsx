import React from 'react';
import {Pressable, Text} from 'react-native';

const Button = ({text, onPress, classname, textClassName = ''}) => (
  <Pressable
    className={`justify-center h-16 w-48 bg-dark-base rounded-2xl border-2 border-black ${classname}`}
    onPress={() => onPress()}>
    <Text
      className={`capitalize text-center w-full text-3xl text-white font-black ${textClassName}`}>
      {text}
    </Text>
  </Pressable>
);

export default Button;
