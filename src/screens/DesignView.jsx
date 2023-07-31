import React, {useEffect, useRef, useState} from 'react';
import {API, StorageService} from '../services';
import {Image, Pressable, Share, StatusBar, View} from 'react-native';
import {Button, LoadingModal} from '../components';
import {Consts} from '../consts';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {BANNER_ID} from '@env';

const {SafeAreaView} = require('react-native');

const DesignView = ({translate, navigation}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [assistantID, setAssistantID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('assistant_id').then(setAssistantID);
      StorageService.load('image_url').then(setImageUrl);
      StorageService.load('view_count').then(count => {
        StorageService.save('view_count', (parseInt(count, 10) - 1).toString());
      });
    }
  }, []);

  const remake = (attempts = 0) =>
    API.view(assistantID)
      .then(({response}) => {
        StorageService.load('view_count').then(count =>
          StorageService.save(
            'view_count',
            (parseInt(count, 10) - 1).toString(),
          ),
        );
        setIsLoading(false);
        setImageUrl(response);
      })
      .catch(e => {
        console.warn(e);
        if (attempts < Consts.MAX_ATTEMPTS) {
          remake(attempts + 1);
        } else {
          setIsLoading(false);
        }
      });

  const onRemake = () => {
    StorageService.load('view_count').then(count => {
      if (parseInt(count, 10) <= 0) {
        navigation.pop(1);
      } else {
        setIsLoading(true);
        remake();
      }
    });
  };

  const onShare = () =>
    Share.share({
      message: `${translate('share-message')} ${imageUrl}`,
    });

  const buttonsClassName =
    'w-12 h-12 items-center justify-center mr-2 bg-light-base rounded-full border-2 border-black';
  const iconsClassName = 'aspect-square h-[50%]';

  return (
    <SafeAreaView className="items-center h-full w-full bg-base">
      <StatusBar className="bg-base" />
      <View className="justify-between">
        <View className="flex-1 p-8">
          <Pressable className="aspect-square w-full" onPress={() => {}}>
            <LoadingModal isVisible={isLoading} />
            {imageUrl !== '' && !isLoading ? (
              <Image className="w-full h-full" source={{uri: imageUrl}} />
            ) : null}
          </Pressable>
          <View className="flex-row items-center justify-between mt-5">
            <View className="flex-1">
              <Button
                classname="w-32 h-10"
                textClassName="text-xl"
                text={translate('remake')}
                onPress={() => onRemake()}
              />
            </View>
            {/* <Pressable className={buttonsClassName} onPress={() => {}}>
          <Image
          className={iconsClassName}
          source={require('../assets/icons/copy.png')}
          />
        </Pressable> */}
            {/* <Pressable className={buttonsClassName} onPress={() => {}}>
          <Image
          className={iconsClassName}
          source={require('../assets/icons/download.png')}
          />
        </Pressable> */}
            <Pressable className={buttonsClassName} onPress={() => onShare()}>
              <Image
                className={iconsClassName}
                source={require('../assets/icons/share.png')}
              />
            </Pressable>
          </View>
        </View>
        <BannerAd
          unitId={__DEV__ ? TestIds.BANNER : BANNER_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={Consts.AD_PREFERENCES}
        />
      </View>
    </SafeAreaView>
  );
};

export default DesignView;
