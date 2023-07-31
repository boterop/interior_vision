import React, {useState} from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import Triangle from './Triangle';

const LangDescription = ({lang, onSelectLanguage}) => (
  <Pressable
    className="flex-row w-full h-14 mb-2"
    onPress={() => onSelectLanguage(lang)}>
    <View className="justify-center ">
      <Image className="h-full w-[50px] mr-3" source={lang.icon} />
    </View>
    <View className="justify-center h-full">
      <Text className="capitalize w-full text-2xl text-black font-black">
        {lang.name}
      </Text>
    </View>
  </Pressable>
);

const Modal = ({values, onSelectLanguage}) => (
  <View className="items-left bg-light-base mt-5 mb-28 p-4 w-64 h-44 rounded-3xl border-2 border-black">
    <FlatList
      data={values}
      renderItem={({item}) => (
        <LangDescription lang={item} onSelectLanguage={onSelectLanguage} />
      )}
    />
  </View>
);

const SelectBox = ({values, onSelectLanguage, className, icon}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className="items-center">
      <Pressable
        className={`justify-end items-center h-32 w-32 pb-2 bg-light-base rounded-2xl border-2 border-black ${className}`}
        onPress={() => setIsVisible(!isVisible)}>
        <Image className="h-[55%] w-[55%] mb-1" source={icon} />
        <Triangle />
      </Pressable>
      {isVisible ? (
        <Modal values={values} onSelectLanguage={onSelectLanguage} />
      ) : null}
    </View>
  );
};

export default SelectBox;
export {Modal, LangDescription};
