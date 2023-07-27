import React, {useEffect, useRef, useState} from 'react';
import {StorageService} from '../services';
import {Image, Pressable, StatusBar, View} from 'react-native';

const {SafeAreaView} = require('react-native');

const DesignView = ({translate, navigation}) => {
  const [imageUrl, setImageUrl] = useState('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('view_count').then(count => {
        if (parseInt(count, 10) <= 0) {
          navigation.pop(1);
        } else {
          StorageService.load('image_url').then(setImageUrl);
          StorageService.save(
            'view_count',
            (parseInt(count, 10) - 1).toString(),
          );
        }
      });
    }
  });

  const buttonsClassName = 'w-10 h-12 items-center justify-center pr-2';

  return (
    <SafeAreaView className="items-center h-full w-full bg-base justify-between p-8">
      <StatusBar hidden />
      <View className="aspect-square w-full">
        {imageUrl !== '' ? (
          <Image className="w-full h-full" source={{uri: imageUrl}} />
        ) : null}
      </View>
      <View className="flex-row">
        <Pressable className={buttonsClassName} onPress={() => {}}>
          <Image
            className="w-[70%] h-[50%]"
            source={require('../assets/icons/send.png')}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default DesignView;
