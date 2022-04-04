import axios from 'axios';
// config
import { HOST_API } from '../config';
import { setSession } from './jwt';

// ----------------------------------------------------------------------

const setupAxios = () => {
  // setup baseURL
  axios.defaults.baseURL = HOST_API;
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  // check Bearer Token
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    setSession(accessToken);
  }

  axios.interceptors.response.use(
    (response) => response,
    (error) => error.response || 'Alguma coisa deu errado!'
  );
};

export default setupAxios;
