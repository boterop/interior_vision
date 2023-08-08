import axios from 'axios';
import {
  API_URL,
  API_KEY,
  CRYPTO_ENDPOINT,
  INTERIOR_VISION_ENDPOINT,
  TEST_API_URL,
} from '@env';

const post = (endpoint, uri, body = {}) =>
  axios
    .post(format(endpoint, uri), body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY,
      },
    })
    .then(response => response.data);

const get = (endpoint, uri) =>
  axios
    .get(format(endpoint, uri), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY,
      },
    })
    .then(response => response.data);

const format = (endpoint, uri) => {
  let url = '';
  if (endpoint === INTERIOR_VISION_ENDPOINT) {
    url = __DEV__
      ? TEST_API_URL + uri
      : API_URL + INTERIOR_VISION_ENDPOINT + uri;
  } else if (endpoint === CRYPTO_ENDPOINT) {
    url = API_URL + CRYPTO_ENDPOINT + uri;
  }

  console.log(url);

  return url;
};

const API = {
  createAssistant: language =>
    post(INTERIOR_VISION_ENDPOINT, '/create-assistant', {language: language}),
  getMemory: (assistantID, assistantKey) =>
    post(INTERIOR_VISION_ENDPOINT, '/get-memory', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
    }),
  ask: (question, assistantID, assistantKey) =>
    post(INTERIOR_VISION_ENDPOINT, '/ask', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
      message: question,
    }),
  view: (assistantID, assistantKey) =>
    post(INTERIOR_VISION_ENDPOINT, '/view', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
    }),
  cleanMemory: (assistantID, assistantKey, language) =>
    post(INTERIOR_VISION_ENDPOINT, '/clean-memory', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
      language: language,
    }),
  base64Image: imageUrl =>
    post(CRYPTO_ENDPOINT, '/base64-image', {'image-url': imageUrl}),
  genUUID: () => get(CRYPTO_ENDPOINT, '/gen-uuid'),
};

export default API;
