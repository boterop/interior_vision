import axios from 'axios';
import {API_URL} from '@env';

const post = (uri, body = {}) =>
  axios
    .post(API_URL + uri, body, {
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
};

export default API;
