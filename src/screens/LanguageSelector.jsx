import React, {useState} from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import {Button, SelectBox} from '../components';

const getLanguageByCode = (values, code) =>
  values.filter(lang => lang.code === code)[0];

const LangDescription = ({lang, onSetLanguage}) => (
  <Pressable
    className="flex-row w-full h-14 mb-2"
    onPress={() => onSetLanguage(lang)}>
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

const Modal = ({values, onSetLanguage}) => (
  <View className="items-left bg-light-base mt-5 mb-28 p-4 w-64 h-44 rounded-3xl border-2 border-black">
    <FlatList
      data={values}
      renderItem={({item}) => (
        <LangDescription lang={item} onSetLanguage={onSetLanguage} />
      )}
    />
  </View>
);

const LanguageSelector = ({translate, currentLanguage, onChangeLanguage}) => {
  const values = [
    {icon: require('../assets/icons/spanish.png'), name: 'spanish', code: 'es'},
    {icon: require('../assets/icons/english.png'), name: 'english', code: 'en'},
    {icon: require('../assets/icons/french.png'), name: 'french', code: 'fr'},
  ];

  const initialLanguage = getLanguageByCode(values, currentLanguage);

  const [language, setLanguage] = useState(
    initialLanguage ? initialLanguage.name : 'english',
  );
  const [isVisible, setIsVisible] = useState(false);

  const onSelectLanguage = ({name, code}) => {
    setLanguage(name);
    onChangeLanguage(code);
  };

  return (
    <Pressable
      className="relative items-center h-full w-full"
      onPress={() => setIsVisible(false)}>
      <View className="bottom-0 absolute flexflex-wrap items-center justify-between h-[65%] w-full mb-10">
        <SelectBox
          onPress={() => {
            setIsVisible(!isVisible);
          }}
          defaultValue={language}
          values={values}
        />
        {isVisible ? (
          <Modal values={values} onSetLanguage={onSelectLanguage} />
        ) : null}
        <Button onPress={() => setIsVisible(false)} text={translate('acept')} />
      </View>
    </Pressable>
  );
};

export default LanguageSelector;
