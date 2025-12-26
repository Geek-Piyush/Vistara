/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';

// Get all tours with optional filters
export const getTours = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/v1/tours?${queryParams}` : '/api/v1/tours';

    const res = await axios({
      method: 'GET',
      url,
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load tours.';
    showAlert('error', message);
    return [];
  }
};

// Search tours by name
export const searchTours = async (searchTerm) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/tours?name[regex]=${searchTerm}&name[options]=i`,
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Search failed.';
    showAlert('error', message);
    return [];
  }
};

// Get tours within a certain distance
export const getToursWithin = async (distance, lat, lng, unit = 'mi') => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/tours/tours-within/${distance}/center/${lat},${lng}/unit/${unit}`,
    });

    return res.data.data.data;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to find nearby tours.';
    showAlert('error', message);
    return [];
  }
};

// Get distances to all tours from a point
export const getDistances = async (lat, lng, unit = 'mi') => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/tours/distances/${lat},${lng}/unit/${unit}`,
    });

    return res.data.data.data;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to calculate distances.';
    showAlert('error', message);
    return [];
  }
};

// Get top 5 cheap tours
export const getTopCheapTours = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/tours/top-5-cheap',
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load top tours.';
    showAlert('error', message);
    return [];
  }
};

// Get tour statistics
export const getTourStats = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/tours/get-tour-stats',
    });

    return res.data.data.stats;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load statistics.';
    showAlert('error', message);
    return [];
  }
};
