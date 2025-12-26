/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: { email },
    });

    if (res.data.status === 'Success') {
      showAlert('success', 'Password reset link sent to your email!');
    }
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to send reset link. Try again.';
    showAlert('error', message);
  }
};
