import React, {useEffect, useRef, useState} from 'react';
import {Chat, LanguageSelector} from './screens';
import {useTranslation} from 'react-i18next';
import {StorageService} from './services';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import './lang/i18n';

const App = () => {
  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState('en');
  const isInitialMount = useRef(true);

  const {Screen, Navigator} = createNativeStackNavigator();

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
      })
      .catch(err => console.error(err));

  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="language_selector"
        screenOptions={{
          headerShown: false,
        }}>
        <Screen name="language_selector">
          {props => (
            <LanguageSelector
              {...props}
              translate={t}
              currentLanguage={currentLanguage}
              onChangeLanguage={onChangeLanguage}
            />
          )}
        </Screen>
        <Screen name="chat">
          {props => <Chat {...props} translate={t} language={currentLanguage} />}
        </Screen>
      </Navigator>
    </NavigationContainer>
  );
};

export default App;
