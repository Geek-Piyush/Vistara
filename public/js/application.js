/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';

export const submitGuideApplication = async (formData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/applications/guide-applications',
      data: formData,
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Application submitted successfully! We will review it and get back to you soon.',
      );

      // Clear form after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
    return res.data.data.application;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      'Failed to submit application. Please try again.';
    showAlert('error', message);
    return null;
  }
};

export const submitJobApplication = async (formData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/applications/job-applications',
      data: formData,
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Application submitted successfully! We will review it and get back to you soon.',
      );

      // Clear form and close modal after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    return res.data.data.application;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      'Failed to submit application. Please try again.';
    showAlert('error', message);
    return null;
  }
};

// Admin functions for managing applications
export const updateApplicationStatus = async (applicationId, type, status) => {
  try {
    const endpoint =
      type === 'guide' ? 'guide-applications' : 'job-applications';
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/applications/${endpoint}/${applicationId}`,
      data: { status },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Status updated successfully!');
    }
    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to update status.';
    showAlert('error', message);
    return null;
  }
};

export const deleteApplication = async (applicationId, type) => {
  try {
    const endpoint =
      type === 'guide' ? 'guide-applications' : 'job-applications';
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/applications/${endpoint}/${applicationId}`,
      withCredentials: true,
    });

    showAlert('success', 'Application deleted successfully!');
    return true;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to delete application.';
    showAlert('error', message);
    return false;
  }
};

export const getApplicationDetails = async (applicationId, type) => {
  try {
    const endpoint =
      type === 'guide' ? 'guide-applications' : 'job-applications';
    const res = await axios({
      method: 'GET',
      url: `/api/v1/applications/${endpoint}/${applicationId}`,
      withCredentials: true,
    });

    return res.data.data.data;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to fetch application details.';
    showAlert('error', message);
    return null;
  }
};
