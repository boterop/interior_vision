import React from 'react';
import {Image, Pressable} from 'react-native';
import {Colors} from '../statics';
import Triangle from './Triangle';

const SelectBox = ({onPress, className, defaultValue, values}) => {
  const getIconByName = name =>
    values.filter(lang => lang.name === name)[0].icon;

  return (
    <Pressable
      className={`justify-end items-center h-32 w-32 pb-3 bg-[${Colors.light_base}] rounded-2xl border-2 border-black ${className}`}
      onPress={() => onPress()}>
      <Image className="h-[55%] w-[55%]" source={getIconByName(defaultValue)} />
      <Triangle className="w-8" color={Colors.dark_base} />
    </Pressable>
  );
};

export default SelectBox;
