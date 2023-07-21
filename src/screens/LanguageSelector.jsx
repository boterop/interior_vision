import React, {useState} from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import {Button, SelectBox} from '../components';
import {Colors} from '../statics';

const LangDescription = ({lang, setLanguage}) => {
  const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <Pressable
      className="flex-row w-full h-14 mb-2"
      onPress={() => setLanguage(lang.name)}>
      <View className="justify-center ">
        <Image className="h-full w-[50px] mr-3" source={lang.icon} />
      </View>
      <View className="justify-center h-full">
        <Text
          className="w-full text-2xl text-black font-black"
          color={Colors.dark_base}>
          {capitalize(lang.name)}
        </Text>
      </View>
    </Pressable>
  );
};

const Modal = ({values, setLanguage}) => (
  <View
    className={`items-left bg-white mt-5 mb-28 p-4 [${Colors.light_base}] w-64 h-44 rounded-3xl border-2 border-black`}>
    <FlatList
      data={values}
      renderItem={({item}) => (
        <LangDescription lang={item} setLanguage={setLanguage} />
      )}
    />
  </View>
);

const LanguageSelector = () => {
  const [language, setLanguage] = useState('english');
  const [isVisible, setIsVisible] = useState(false);

  const values = [
    {icon: require('../assets/icons/spanish.png'), name: 'spanish'},
    {icon: require('../assets/icons/english.png'), name: 'english'},
    {icon: require('../assets/icons/english.png'), name: 'french'},
  ];

  const onAcept = () => {
    setIsVisible(false);
  };

  return (
    <Pressable
      className={`relative items-center h-full w-full bg-[${Colors.base}]`}
      onPress={() => setIsVisible(false)}>
      <View className="bottom-0 absolute flexflex-wrap items-center justify-between h-[65%] w-full mb-10">
        <SelectBox
          onPress={() => {
            setIsVisible(!isVisible);
          }}
          defaultValue={language}
          values={values}
        />
        {isVisible ? <Modal values={values} setLanguage={setLanguage} /> : null}
        <Button onPress={onAcept} text="Aceptar" />
      </View>
    </Pressable>
  );
};

export default LanguageSelector;
