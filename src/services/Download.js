import RNFetchBlob from 'rn-fetch-blob';
import API from './API';

const Download = imageUrl =>
  API.genUUID().then(uuid =>
    API.base64Image(imageUrl).then(base64Image => {
      const image64 = base64Image.response.substring(
        23,
        base64Image.response.length,
      );
      const dirs = RNFetchBlob.fs.dirs;

      const path = dirs.PictureDir + `/Interior Vision AI/${uuid.response}.png`;

      RNFetchBlob.fs.writeFile(path, image64, 'base64').then(res => {
        console.log('File : ', res);
      });
    }),
  );

export default Download;
