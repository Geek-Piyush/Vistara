/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
      withCredentials: true, // Ensure credentials (cookies) are sent
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged In Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    console.log('1');
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout',
      withCredentials: true,
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out, Try again!');
  }
};
