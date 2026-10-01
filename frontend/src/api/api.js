import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Generic Fetch
export const getDistributedData = async (endpoint) => {
  const response = await api.get(`/distributed/${endpoint}`);
  return response.data;
};

// CRUD Operations
export const createRecord = async (endpoint, data) => {
  const response = await api.post(`/distributed/${endpoint}`, data);
  return response.data;
};

export const updateRecord = async (endpoint, id, data) => {
  const response = await api.put(`/distributed/${endpoint}/${id}`, data);
  return response.data;
};

export const deleteRecord = async (endpoint, id) => {
  const response = await api.delete(`/distributed/${endpoint}/${id}`);
  return response.data;
};

// Region Specific
export const getRegionData = async (region, endpoint) => {
  const response = await api.get(`/distributed/region/${region}/${endpoint}`);
  return response.data;
};

// Centralized & Fragmentation
export const getCentralizedData = async (endpoint) => {
  const response = await api.get(`/centralized/${endpoint}`);
  return response.data;
};

export const getFragmentationData = async (endpoint) => {
  const response = await api.get(`/fragmentation/${endpoint}`);
  return response.data;
};

// Query Execution
export const executeDistributedQuery = async (sql) => {
  const response = await api.post('/distributed/query', { sql });
  return response.data;
};

// System Health
export const getSystemHealth = async () => {
  const response = await api.get('/distributed/health');
  return response.data;
};

// Database Explorer
export const getExplorerTables = async (region) => {
  const response = await api.get(`/explorer/${region}/tables`);
  return response.data;
};

export const getExplorerTableData = async (region, tableName) => {
  const response = await api.get(`/explorer/${region}/table/${tableName}`);
  return response.data;
};

export default api;
