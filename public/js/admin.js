/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';

// Admin: Get all users
export const getAllUsers = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users',
      withCredentials: true,
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load users.';
    showAlert('error', message);
    return [];
  }
};

// Admin: Get user by ID
export const getUser = async (userId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/${userId}`,
      withCredentials: true,
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load user.';
    showAlert('error', message);
    return null;
  }
};

// Admin: Update user
export const updateUser = async (userId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User updated successfully!');
    }
    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to update user.';
    showAlert('error', message);
    return null;
  }
};

// Admin: Delete user
export const deleteUser = async (userId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`,
      withCredentials: true,
    });

    showAlert('success', 'User deleted successfully!');
    return true;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to delete user.';
    showAlert('error', message);
    return false;
  }
};

// Admin: Create tour
export const createTour = async (tourData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/tours',
      data: tourData,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour created successfully!');
    }
    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to create tour.';
    showAlert('error', message);
    return null;
  }
};

// Admin: Update tour
export const updateTour = async (tourId, tourData) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tours/${tourId}`,
      data: tourData,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour updated successfully!');
    }
    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to update tour.';
    showAlert('error', message);
    return null;
  }
};

// Admin: Delete tour
export const deleteTour = async (tourId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/tours/${tourId}`,
      withCredentials: true,
    });

    showAlert('success', 'Tour deleted successfully!');
    return true;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to delete tour.';
    showAlert('error', message);
    return false;
  }
};

// Admin: Get all bookings
export const getAllBookings = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/booking',
      withCredentials: true,
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load bookings.';
    showAlert('error', message);
    return [];
  }
};

// Admin: Delete booking
export const deleteBooking = async (bookingId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/booking/${bookingId}`,
      withCredentials: true,
    });

    showAlert('success', 'Booking deleted successfully!');
    return true;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to delete booking.';
    showAlert('error', message);
    return false;
  }
};

// Admin: Get all reviews
export const getAllReviews = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/reviews',
      withCredentials: true,
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load reviews.';
    showAlert('error', message);
    return [];
  }
};

// Admin: Delete review
export const deleteReviewAdmin = async (reviewId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`,
      withCredentials: true,
    });

    showAlert('success', 'Review deleted successfully!');
    return true;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to delete review.';
    showAlert('error', message);
    return false;
  }
};
