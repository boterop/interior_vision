import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, SelectBox} from '../components';
import {styled} from 'nativewind';
import {Colors} from '../statics';

const LanguageSelector = () => {
  const StyledView = styled(View);

  const [language, setLanguage] = useState('english');

  const onSelect = () => {};
  const onAcept = () => {};

  return (
    <StyledView
      className={`relative items-center h-full w-full bg-[${Colors.base}]`}>
      <StyledView className="bottom-0 absolute flexflex-wrap items-center justify-between h-[65%] mb-10">
        <SelectBox onPress={onSelect} defaultValue={language} />
        <Button onPress={onAcept} text="Aceptar" />
      </StyledView>
    </StyledView>
  );
};

export default LanguageSelector;
