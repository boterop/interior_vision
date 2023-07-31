import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {Button, SelectBox} from '../components';
import {StorageService} from '../services';
import {Languages} from '../consts';

const LanguageSelector = ({
  navigation,
  translate,
  currentLanguage,
  onChangeLanguage,
}) => {
  const values = Languages.get();

  const [language, setLanguage] = useState(values[0]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('language').then(ft => {
        if (ft !== undefined) {
          navigation.navigate('chat');
        }
      });
    }
  });

  useEffect(() => {
    const initialLanguage = Languages.getLanguageByCode(currentLanguage);
    setLanguage(initialLanguage);
  }, [currentLanguage]);

  const onSelectLanguage = lang => {
    setLanguage(lang);
    onChangeLanguage(lang.code);
  };

  const onAcceptSelection = () => {
    StorageService.save('language', currentLanguage);
    navigation.navigate('chat');
  };

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
