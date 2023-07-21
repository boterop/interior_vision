import React from 'react';
import {Image, Pressable} from 'react-native';
import Triangle from './Triangle';

const SelectBox = ({onPress, className, icon}) => (
  <Pressable
    className={`justify-end items-center h-32 w-32 pb-2 bg-light-base rounded-2xl border-2 border-black ${className}`}
    onPress={() => onPress()}>
    <Image className="h-[55%] w-[55%] mb-1" source={icon} />
    <Triangle className="bg-light-base text-light-base border-t-light-base" />
  </Pressable>
);

export default SelectBox;
