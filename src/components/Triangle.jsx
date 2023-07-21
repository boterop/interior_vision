import React from 'react';
import {View} from 'react-native';

const Triangle = ({className, color}) => (
  <View className={className}>
    <View
      className={`w-0 h-0 border-solid border-l-[15px] border-l-transparent border-t-[25px] border-t-[${color}] border-r-[15px] border-r-transparent border-b-transparent`}
    />
  </View>
);

export default Triangle;
