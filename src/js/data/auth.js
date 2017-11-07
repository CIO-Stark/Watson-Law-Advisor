import axios from 'axios';

const domain = '//portfolio-watson-law-advisor-orchestrator.mybluemix.net';

function _transformResponse (response) {
  if (response.status) {
    localStorage.setItem('user', JSON.stringify(resnpose.data));
    return response.data;
  } else {
    return new Error (response.message);
  }
}


export function authenticate (user) {
  return axios({
    baseURL: domain,
    url: 'auth/login',
    method: 'post',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: user,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function isAuthenticated () {
  return localStorage.getItem('user') || false;
}