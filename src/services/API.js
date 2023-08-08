import axios from 'axios';
import {API_URL, API_KEY} from '@env';

const post = async (uri, body = {}) => {
  let url = API_URL + uri;

  if (__DEV__) {
    url = url.replace('/interior-vision', '/interior-vision/test');
  }

  const response = await axios.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + API_KEY,
    },
  });
  return response.data;
};

const get = uri =>
  axios
    .get(API_URL + uri, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY,
      },
    })
    .then(response => response.data);

const API = {
  createAssistant: language =>
    post('/interior-vision/create-assistant', {language: language}),
  getMemory: (assistantID, assistantKey) =>
    post('/interior-vision/get-memory', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
    }),
  ask: (question, assistantID, assistantKey) =>
    post('/interior-vision/ask', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
      message: question,
    }),
  view: (assistantID, assistantKey) =>
    post('/interior-vision/view', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
    }),
  cleanMemory: (assistantID, assistantKey, language) =>
    post('/interior-vision/clean-memory', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
      language: language,
    }),
  base64Image: imageUrl =>
    post('/cryptography/base64-image', {'image-url': imageUrl}),
  genUUID: () => get('/cryptography/gen-uuid'),
};

export default API;
