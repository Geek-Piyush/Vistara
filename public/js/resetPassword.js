/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';

export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset successful! Logging you in...');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to reset password. Try again.';
    showAlert('error', message);
  }
};
