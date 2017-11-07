import axios from 'axios';

const domain = '//portfolio-watson-law-advisor-orchestrator.mybluemix.net';
const headers = { 'Content-Type': 'application/json' };

const STATUS = {
  PENDING: 'pending',
  REVISED: 'revised'
};

const FIELDS_SISJUR = [
  'Nome da Parte',	
  'Situacao da Parte',
  'CPF/CNPJ/CEI da Parte', 
  'Contratos da Parte',	
  'Matricula',
  'Processo',
  'Vara',
  'Acao',
  'Foro',
  'Area Judicial',
  'Comarca',
  'Situacao Caixa',
  'Centro de Custo',
  'Unidade Subsidio',
  'Dt. Causa',
  'Vr. Causa',
  'Grupo de Assunto',
  'Assunto',
  'Advogado contrário',
  'Endereço da parte',
  'Data do Fato'
];

function _transformResponse (response = {}) {
  if (!response.status) {
    throw new Error (response.message);
  }

  return response.data;
}

function _transformFileRequest (file) {
  let formData = new FormData();
  formData.append(file.name, file);

  return formData;
}

function list (filter) {
  return axios({
    baseURL: domain,
    url: '/file/search',
    method: 'post',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: filter,
    headers: headers
  });
}

function update (data) {
  return axios({
    baseURL: domain,
    url: 'file/update',
    method: 'post',
    responseType: 'json',
    transformResponse: [_transformResponse],
    data: data,
    headers: headers
  });
}

function process (file) {
  return axios({
    baseURL: domain,
    url: 'file/upload',
    method: 'post',
    responseType: 'json',
    transformResponse: [_transformResponse],
    transformRequest: [_transformFileRequest],
    data: file
  });
}

function getCategories () {
  return axios({
    baseURL: domain,
    url: 'file/categories',
    method: 'get',
    responseType: 'json',
    transformResponse: [_transformResponse]
  });
}

export { STATUS, FIELDS_SISJUR, list, update, process, getCategories };
export * from './file.socket';