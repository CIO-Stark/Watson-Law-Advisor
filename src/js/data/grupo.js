import axios from 'axios';
const domain = '//portfolio-watson-law-advisor-orchestrator.mybluemix.net/grupo';
const headers = { 'Content-Type': 'application/json' };

function _transformResponse (response = {}) {
  if (!response.status) {
    throw new Error (response.message);
  }
  return response.data;
}

function load () {
  return axios({
    baseURL: domain,
    url: '/load',
    method: 'get',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: {},
    headers: headers
  });
}

function get (id) {
  return axios({
    baseURL: domain,
    url: ('/get/'+ id),
    method: 'get',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: {},
    headers: headers
  });
}

function getByArea (id_area) {
  return axios({
    baseURL: domain,
    url: ('/getByArea/'+ id_area),
    method: 'get',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: {},
    headers: headers
  });
}

function create (data) {
  return axios({
    baseURL: domain,
    url: '/create',
    method: 'post',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: data,
    headers: headers
  });
}

function update (data) {
  return axios({
    baseURL: domain,
    url: '/update',
    method: 'post',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: data,
    headers: headers
  });
}

function remove (data) {
  return axios({
    baseURL: domain,
    url: '/remove',
    method: 'post',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: data,
    headers: headers
  });
}

export { 
  load,
  get,
  getByArea,
  create,
  update,
  remove
};