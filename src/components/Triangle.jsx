import React from 'react';
import {View} from 'react-native';

const Triangle = ({classname, color = 'black'}) => (
  <View
    className={`w-0 h-0 border-solid border-[${color}] border-l-[12px] border-l-transparent border-t-[20px] border-r-[12px] border-r-transparent border-b-transparent ${classname}`}
  />
);

export default Triangle;
