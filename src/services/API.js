import axios from 'axios';
import {API_URL, TEST_API_URL, API_KEY} from '@env';

const post = (uri, body = {}) =>
  axios
    .post((__DEV__ ? TEST_API_URL : API_URL) + uri, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY,
      },
    })
    .then(response => response.data);

const API = {
  createAssistant: language => post('/create-assistant', {language: language}),
  getMemory: (assistantID, assistantKey) =>
    post('/get-memory', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
    }),
  ask: (question, assistantID, assistantKey) =>
    post('/ask', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
      message: question,
    }),
  view: (assistantID, assistantKey) =>
    post('/view', {assistant_id: assistantID, assistant_key: assistantKey}),
  cleanMemory: (assistantID, assistantKey, language) =>
    post('/clean-memory', {
      assistant_id: assistantID,
      assistant_key: assistantKey,
      language: language,
    }),
};

export default API;
