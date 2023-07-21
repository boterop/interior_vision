import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {LanguageSelector} from './screens';
import {useTranslation} from 'react-i18next';
import {StorageService} from './services';
import './lang/i18n';

const App = () => {
  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState('en');
  const [isStarted, setIsStarted] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('language').then(lang => onChangeLanguage(lang));
    }
  });

  const onChangeLanguage = (value: string | undefined) =>
    i18n
      .changeLanguage(value)
      .then(() => {
        setLanguage(value ? value : 'en');
        setIsStarted(true);
      })
      .catch(err => console.error(err));

  return (
    <SafeAreaView className="bg-base">
      <StatusBar hidden />
      {isStarted ? (
        <LanguageSelector
          translate={t}
          currentLanguage={currentLanguage}
          onChangeLanguage={onChangeLanguage}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default App;
