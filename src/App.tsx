import React, {useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {LanguageSelector} from './screens';
import {useTranslation} from 'react-i18next';
import './lang/i18n';

const App = () => {
  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState('en');

  const onChangeLanguage = value =>
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch(err => console.error(err));

  return (
    <SafeAreaView className="bg-base">
      <StatusBar hidden />
      <LanguageSelector
        translate={t}
        currentLanguage={currentLanguage}
        onChangeLanguage={onChangeLanguage}
      />
    </SafeAreaView>
  );
};

export default App;
