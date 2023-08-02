import axios from 'axios';
import {API_URL, TEST_API_URL} from '@env';

const post = (uri, body = {}) =>
  axios
    .post((__DEV__ ? TEST_API_URL : API_URL) + uri, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.data);

const API = {
  createAssistant: language => post('/create-assistant', {language: language}),
  getMemory: assistantID => post('/get-memory', {assistant_id: assistantID}),
  ask: (question, assistantID) =>
    post('/ask', {assistant_id: assistantID, message: question}),
  view: assistantID => post('/view', {assistant_id: assistantID}),
  cleanMemory: (assistantID, language) =>
    post('/clean-memory', {assistant_id: assistantID, language: language}),
};

export default API;
