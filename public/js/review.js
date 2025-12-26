/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';

// Create a new review
export const createReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review submitted successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to submit review. Try again.';
    showAlert('error', message);
  }
};

// Update a review
export const updateReview = async (reviewId, review, rating) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        review,
        rating,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review updated successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to update review. Try again.';
    showAlert('error', message);
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`,
      withCredentials: true,
    });

    showAlert('success', 'Review deleted successfully!');
    window.setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to delete review. Try again.';
    showAlert('error', message);
  }
};

// Get all reviews for a tour
export const getReviews = async (tourId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/tours/${tourId}/reviews`,
      withCredentials: true,
    });

    return res.data.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load reviews.';
    showAlert('error', message);
    return [];
  }
};
