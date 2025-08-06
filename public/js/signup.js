/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { showAlert } from './alert.js';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role: 'user',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created and logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    const message = err.response?.data?.message || 'Signup failed. Try again.';
    showAlert('error', err.response.data.message);
  }
};
