import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

import LanguageSelector from './screens/LanguageSelector';

function App(): JSX.Element {
  const backgroundStyle = 'bg-neutral-300 dark:bg-slate-900';

  return (
    <SafeAreaView className={backgroundStyle}>
      <StatusBar hidden />
      <LanguageSelector />
    </SafeAreaView>
  );
}

export default App;
