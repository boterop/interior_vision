import React, {useEffect, useRef, useState} from 'react';
import {StorageService} from '../services';
import {Image, Pressable, StatusBar, View} from 'react-native';
import {Button} from '../components';

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

  const buttonsClassName =
    'w-12 h-12 items-center justify-center mr-2 bg-dark-base rounded-full border-2 border-black';
  const iconsClassName = 'aspect-square h-[50%]';

  return (
    <SafeAreaView className="items-center h-full w-full bg-base p-8">
      <StatusBar hidden />
      <Pressable className="aspect-square w-full" onPress={() => {}}>
        {imageUrl !== '' ? (
          <Image className="w-full h-full" source={{uri: imageUrl}} />
        ) : null}
      </Pressable>
      <View className="flex-row items-center justify-between mt-5">
        <View className="flex-1">
          <Button
            classname="w-32 h-10"
            textClassName="text-xl"
            text={translate('remake')}
            onPress={() => {}}
          />
        </View>
        <Pressable className={buttonsClassName} onPress={() => {}}>
          <Image
            className={iconsClassName}
            source={require('../assets/icons/copy.png')}
          />
        </Pressable>
        <Pressable className={buttonsClassName} onPress={() => {}}>
          <Image
            className={iconsClassName}
            source={require('../assets/icons/download.png')}
          />
        </Pressable>
        <Pressable className={buttonsClassName} onPress={() => {}}>
          <Image
            className={iconsClassName}
            source={require('../assets/icons/share.png')}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default DesignView;
