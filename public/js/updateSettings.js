/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { showAlert } from './alert.js';

//type is either data or password
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMyDetail';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
      withCredentials: true,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updates successfully`);
    }
  } catch (error) {
    showAlert('error', error.response?.data?.message);
  }
};
