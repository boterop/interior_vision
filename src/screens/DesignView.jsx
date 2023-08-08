import React, {useEffect, useRef, useState} from 'react';
import {API, Download, StorageService} from '../services';
import {Image, Pressable, Share, View} from 'react-native';
import {Button, LoadingModal} from '../components';
import {Consts} from '../consts';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {BANNER_ID} from '@env';
import {ImageZoom} from '@likashefqet/react-native-image-zoom';

const DesignView = ({translate, showAd, loadAd}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [assistantID, setAssistantID] = useState('');
  const [assistantKey, setAssistantKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updateState, setUpdate] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      StorageService.load('assistant_id').then(setAssistantID);
      StorageService.load('assistant_key').then(setAssistantKey);
      StorageService.load('image_url').then(setImageUrl);
      StorageService.load('view_count').then(count =>
        StorageService.save('view_count', (parseInt(count, 10) - 1).toString()),
      );
    }
  }, []);

  useEffect(() => loadAd.chat());
  useEffect(() => loadAd.view());

  const update = () => setUpdate(!updateState);

  const remake = (attempts = 0) =>
    API.view(assistantID, assistantKey)
      .then(({response}) => {
        if (response === 'Internal server error') {
          if (attempts < Consts.MAX_ATTEMPTS) {
            update();
            showAd();
            showAd(1);
            remake(attempts + 1);
          } else {
            setIsLoading(false);
          }
        } else {
          StorageService.load('view_count').then(count =>
            StorageService.save(
              'view_count',
              (parseInt(count, 10) - 1).toString(),
            ),
          );
          setImageUrl(response);
          setIsLoading(false);
        }
      })
      .catch(e => {
        console.warn(e);
        if (attempts < Consts.MAX_ATTEMPTS) {
          update();
          remake(attempts + 1);
        } else {
          setIsLoading(false);
        }
      });

  const onRemake = () => {
    setIsLoading(true);
    StorageService.load('view_count').then(count => {
      if (parseInt(count, 10) <= 0) {
        if (!showAd()) {
          showAd(1);
        }
      }

      remake();
    });
  };

  const onShare = () =>
    API.base64Image(imageUrl).then(image64 =>
      Share.share({
        message: `${translate('share-message')}`,
        url: image64.response,
      }),
    );

  const onDownload = () => {
    update();
    setIsLoading(true);
    showAd(1);

    Download(imageUrl).finally(() => setIsLoading(false));
  };

  const buttonsClassName =
    'w-12 h-12 items-center justify-center mr-2 bg-light-base rounded-full border-2 border-black';
  const iconsClassName = 'aspect-square h-[50%]';

  return (
    <View className="items-center h-full w-full bg-base">
      <View className="justify-between">
        <View className="flex-1 p-8">
          <Pressable className="aspect-square w-full" onPress={() => {}}>
            <LoadingModal isVisible={isLoading} />
            {imageUrl !== '' && !isLoading ? (
              <ImageZoom className="w-full h-full" uri={imageUrl} />
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
            <Pressable
              className={buttonsClassName}
              onPress={() => onDownload()}>
              <Image
                className={iconsClassName}
                source={require('../assets/icons/download.png')}
              />
            </Pressable>
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
    </View>
  );
};

export default DesignView;
