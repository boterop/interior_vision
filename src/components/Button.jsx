import React from 'react';
import {Pressable, Text} from 'react-native';
import {Colors} from '../statics';

const Button = ({text, onPress, classname}) => (
  <Pressable
    className={`justify-center h-16 w-48 bg-[${Colors.dark_base}] rounded-2xl border-2 border-black ${classname}`}
    onPress={() => onPress()}>
    <Text className="text-center w-full text-3xl text-white font-black">
      {text}
    </Text>
  </Pressable>
);

export default Button;
