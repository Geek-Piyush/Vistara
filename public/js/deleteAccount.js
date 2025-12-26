/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';

// Delete user's own account
export const deleteMyAccount = async () => {
  try {
    await axios({
      method: 'DELETE',
      url: '/api/v1/users/deleteMyProfile',
      withCredentials: true,
    });

    showAlert('success', 'Your account has been deleted.');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to delete account. Try again.';
    showAlert('error', message);
  }
};
