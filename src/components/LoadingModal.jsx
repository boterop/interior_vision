import React from 'react';
import {Image, View} from 'react-native';

const LoadingModal = ({isVisible}) => {
  const timeout = 25000;

  if (!isVisible) {
    return null;
  } else {
    setTimeout(() => (isVisible = false), timeout);
  }
  return (
    <View className="absolute w-full h-full items-center justify-center">
      <View className="absolute w-full h-full bg-dark-dark opacity-70 items-center justify-center" />
      <Image
        className="w-[50px] h-[50px]"
        source={require('../assets/icons/loading.gif')}
      />
    </View>
  );
};

export default LoadingModal;
