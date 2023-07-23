import React from 'react';
import {View} from 'react-native';

const TextInput = ({classname}) => {
  return (
    <View
      className={`bg-light-base rounded-full border-2 border-black h-10 w-full ${classname}`}
    />
  );
};

export default TextInput;
