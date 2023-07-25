import React, {useRef, useState} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {Button, SelectBox} from '../components';
import {StorageService} from '../services';

const getLanguageByCode = (values, code) =>
  values.filter(lang => lang.code === code)[0];

const LanguageSelector = ({
  navigation,
  translate,
  currentLanguage,
  onChangeLanguage,
}) => {
  const values = [
    {icon: require('../assets/icons/english.png'), name: 'english', code: 'en'},
    {icon: require('../assets/icons/spanish.png'), name: 'spanish', code: 'es'},
    {icon: require('../assets/icons/french.png'), name: 'french', code: 'fr'},
  ];

  const [language, setLanguage] = useState(values[0]);
  const isInitialMount = useRef(true);

  const onSelectLanguage = lang => {
    setLanguage(lang);
    onChangeLanguage(lang.code);
  };

  const onAcceptSelection = () => {
    StorageService.save('language', currentLanguage);
    navigation.navigate('chat');
  };

  if (isInitialMount.current) {
    isInitialMount.current = false;

    const initialLanguage = getLanguageByCode(values, currentLanguage);
    setLanguage(initialLanguage);
  }

  return (
    <SafeAreaView className="relative items-center bg-base h-full w-full">
      <StatusBar hidden />
      <View className="bottom-0 absolute flexflex-wrap items-center justify-between h-[65%] w-full mb-10">
        <SelectBox
          values={values}
          onSelectLanguage={onSelectLanguage}
          icon={language.icon}
        />
        <Button onPress={onAcceptSelection} text={translate('accept')} />
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelector;
