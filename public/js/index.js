/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';
import { signup } from './signup.js';
import { forgotPassword } from './forgotPassword.js';
import { resetPassword } from './resetPassword.js';
import { createReview, deleteReview, updateReview } from './review.js';
import {
  deleteUser,
  deleteTour,
  deleteBooking,
  deleteReviewAdmin,
  createTour,
  updateTour,
  updateUser,
} from './admin.js';
import { deleteMyAccount } from './deleteAccount.js';
import { submitContactForm } from './contact.js';
import { showAlert } from './alert.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.form--login');
  const signupForm = document.querySelector('.form--signup');
  const forgotPasswordForm = document.querySelector('.form--forgot-password');
  const resetPasswordForm = document.querySelector('.form--reset-password');
  const logOutBtn = document.querySelector('.nav__el--logout');
  const userDataForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-password');
  const bookBtn = document.getElementById('book-tour');
  const reviewForm = document.querySelector('.form--review');
  const createTourForm = document.querySelector('.form--create-tour');
  const editTourForm = document.querySelector('.form--edit-tour');
  const editUserForm = document.querySelector('.form--edit-user');
  const searchForm = document.querySelector('.form--search');
  const contactForm = document.querySelector('.contact-form');

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email');
      const password = document.getElementById('login-password');
      if (email && password) {
        login(email.value, password.value);
      }
    });
  }

  // SIGNUP
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name');
      const email = document.getElementById('signup-email');
      const password = document.getElementById('signup-password');
      const confirmPassword = document.getElementById(
        'signup-password-confirm',
      );
      if (name && email && password && confirmPassword) {
        signup(name.value, email.value, password.value, confirmPassword.value);
      }
    });
  }

  // FORGOT PASSWORD
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email');
      if (email) {
        forgotPassword(email.value);
      }
    });
  }

  // RESET PASSWORD
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password');
      const passwordConfirm = document.getElementById('password-confirm');
      const resetBtn = document.querySelector('.btn-reset-password');
      const token =
        resetBtn?.dataset?.token || window.location.pathname.split('/').pop();

      if (password && passwordConfirm && token) {
        resetPassword(password.value, passwordConfirm.value, token);
      }
    });
  }

  // LOGOUT
  if (logOutBtn) {
    logOutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // UPDATE USER DATA
  if (userDataForm) {
    userDataForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const photo = document.getElementById('photo');
      if (name && email && photo) {
        const form = new FormData();
        form.append('name', name.value);
        form.append('email', email.value);
        form.append('photo', photo.files[0]);
        updateSettings(form, 'data');
      }
    });
  }

  // UPDATE USER PASSWORD
  if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passwordCurrent = document.getElementById('password-current');
      const password = document.getElementById('password');
      const passwordConfirm = document.getElementById('password-confirm');
      if (passwordCurrent && password && passwordConfirm) {
        await updateSettings(
          {
            passwordCurrent: passwordCurrent.value,
            password: password.value,
            passwordConfirm: passwordConfirm.value,
          },
          'password',
        );
        passwordCurrent.value = '';
        password.value = '';
        passwordConfirm.value = '';
      }
    });
  }

  // BOOK TOUR
  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      const { tourId } = e.target.dataset;
      if (tourId) bookTour(tourId);
    });
  }

  // SUBMIT REVIEW
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const review = document.getElementById('review');
      const rating = document.getElementById('rating');
      const tourId = reviewForm.dataset.tourId;

      if (review && rating && tourId) {
        createReview(tourId, review.value, parseInt(rating.value));
      }
    });
  }

  // CREATE TOUR (Admin)
  if (createTourForm) {
    createTourForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Use FormData for file uploads
      const formData = new FormData();

      formData.append('name', document.getElementById('tour-name').value);
      formData.append('slug', document.getElementById('tour-slug').value);
      formData.append(
        'duration',
        document.getElementById('tour-duration').value,
      );
      formData.append(
        'maxGroupSize',
        document.getElementById('tour-maxGroupSize').value,
      );
      formData.append(
        'difficulty',
        document.getElementById('tour-difficulty').value,
      );
      formData.append('price', document.getElementById('tour-price').value);
      formData.append(
        'priceDiscount',
        document.getElementById('tour-priceDiscount').value || 0,
      );
      formData.append('summary', document.getElementById('tour-summary').value);
      formData.append(
        'description',
        document.getElementById('tour-description').value,
      );

      // Handle image cover file upload
      const imageCoverInput = document.getElementById('tour-imageCover');
      if (imageCoverInput.files[0]) {
        formData.append('imageCover', imageCoverInput.files[0]);
      }

      // Handle multiple tour images
      const imagesInput = document.getElementById('tour-images');
      if (imagesInput.files.length > 0) {
        for (let i = 0; i < imagesInput.files.length; i++) {
          formData.append('images', imagesInput.files[i]);
        }
      }

      // Add start location as JSON string
      const startLocation = {
        type: 'Point',
        coordinates: [
          parseFloat(document.getElementById('tour-startLocation-lng').value),
          parseFloat(document.getElementById('tour-startLocation-lat').value),
        ],
        description: document.getElementById('tour-startLocation-description')
          .value,
        address:
          document.getElementById('tour-startLocation-address').value || '',
      };
      formData.append('startLocation', JSON.stringify(startLocation));
      formData.append(
        'startDates',
        document.getElementById('tour-startDate').value,
      );

      const result = await createTour(formData);
      if (result) {
        window.setTimeout(() => {
          location.assign('/manage-tours');
        }, 1500);
      }
    });
  }

  // EDIT TOUR (Admin)
  if (editTourForm) {
    editTourForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const tourId = editTourForm.dataset.tourId;

      const tourData = {
        name: document.getElementById('edit-tour-name').value,
        slug: document.getElementById('edit-tour-slug').value,
        duration: parseInt(document.getElementById('edit-tour-duration').value),
        maxGroupSize: parseInt(
          document.getElementById('edit-tour-maxGroupSize').value,
        ),
        difficulty: document.getElementById('edit-tour-difficulty').value,
        price: parseFloat(document.getElementById('edit-tour-price').value),
        priceDiscount:
          parseFloat(
            document.getElementById('edit-tour-priceDiscount').value,
          ) || 0,
        summary: document.getElementById('edit-tour-summary').value,
        description: document.getElementById('edit-tour-description').value,
        imageCover: document.getElementById('edit-tour-imageCover').value,
        startLocation: {
          type: 'Point',
          coordinates: [
            parseFloat(
              document.getElementById('edit-tour-startLocation-lng').value,
            ),
            parseFloat(
              document.getElementById('edit-tour-startLocation-lat').value,
            ),
          ],
          description: document.getElementById(
            'edit-tour-startLocation-description',
          ).value,
          address:
            document.getElementById('edit-tour-startLocation-address').value ||
            '',
        },
      };

      const result = await updateTour(tourId, tourData);
      if (result) {
        window.setTimeout(() => {
          location.assign('/manage-tours');
        }, 1500);
      }
    });
  }

  // EDIT USER (Admin)
  if (editUserForm) {
    editUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userId = editUserForm.dataset.userId;

      const userData = {
        name: document.getElementById('edit-user-name').value,
        email: document.getElementById('edit-user-email').value,
        role: document.getElementById('edit-user-role').value,
        active: document.getElementById('edit-user-active').checked,
      };

      const result = await updateUser(userId, userData);
      if (result) {
        window.setTimeout(() => {
          location.assign('/manage-users');
        }, 1500);
      }
    });
  }

  // DELETE REVIEW (User)
  document.querySelectorAll('.btn-delete-review').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { reviewId } = e.target.dataset;
      if (reviewId && confirm('Are you sure you want to delete this review?')) {
        deleteReview(reviewId);
      }
    });
  });

  // ADMIN: DELETE USER
  document.querySelectorAll('.btn-delete-user').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { userId } = e.target.dataset;
      if (userId && confirm('Are you sure you want to delete this user?')) {
        deleteUser(userId).then((success) => {
          if (success) location.reload();
        });
      }
    });
  });

  // ADMIN: DELETE TOUR
  document.querySelectorAll('.btn-delete-tour').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { tourId } = e.target.dataset;
      if (tourId && confirm('Are you sure you want to delete this tour?')) {
        deleteTour(tourId).then((success) => {
          if (success) location.reload();
        });
      }
    });
  });

  // STAR RATING INTERACTION
  const starRating = document.querySelector('.star-rating');
  if (starRating) {
    const stars = starRating.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    let currentRating = 5;

    // Initialize all stars as active
    stars.forEach((star) => star.classList.add('active'));

    stars.forEach((star, index) => {
      // Click to set rating
      star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.value);
        ratingInput.value = currentRating;
        updateStars(currentRating);
      });

      // Hover effect
      star.addEventListener('mouseenter', () => {
        const hoverValue = parseInt(star.dataset.value);
        stars.forEach((s, i) => {
          if (i < hoverValue) {
            s.classList.add('hovered');
          } else {
            s.classList.remove('hovered');
          }
        });
      });
    });

    // Reset to current rating on mouse leave
    starRating.addEventListener('mouseleave', () => {
      stars.forEach((s) => s.classList.remove('hovered'));
      updateStars(currentRating);
    });

    function updateStars(rating) {
      stars.forEach((s, i) => {
        if (i < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    }
  }

  // FILTER TOGGLE BUTTON
  const filterToggleBtn = document.querySelector('.filter-toggle-btn');
  const filtersMenu = document.querySelector('.filters-menu');

  if (filterToggleBtn && filtersMenu) {
    filterToggleBtn.addEventListener('click', () => {
      filtersMenu.classList.toggle('hidden');
    });
  }

  // FILTERING AND SORTING
  const filterDifficulty = document.getElementById('filter-difficulty');
  const sortBy = document.getElementById('sort-by');

  if (filterDifficulty || sortBy) {
    const applyFilters = () => {
      const params = new URLSearchParams(window.location.search);

      if (filterDifficulty && filterDifficulty.value) {
        params.set('difficulty', filterDifficulty.value);
      } else {
        params.delete('difficulty');
      }

      if (sortBy && sortBy.value) {
        params.set('sort', sortBy.value);
      } else {
        params.delete('sort');
      }

      window.location.href = `/?${params.toString()}`;
    };

    if (filterDifficulty) {
      filterDifficulty.addEventListener('change', applyFilters);
      // Set current value from URL
      const urlParams = new URLSearchParams(window.location.search);
      const difficulty = urlParams.get('difficulty');
      if (difficulty) filterDifficulty.value = difficulty;
    }

    if (sortBy) {
      sortBy.addEventListener('change', applyFilters);
      // Set current value from URL
      const urlParams = new URLSearchParams(window.location.search);
      const sort = urlParams.get('sort');
      if (sort) sortBy.value = sort;
    }
  }

  // ADMIN: DELETE BOOKING
  document.querySelectorAll('.btn-delete-booking').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { bookingId } = e.target.dataset;
      if (
        bookingId &&
        confirm('Are you sure you want to delete this booking?')
      ) {
        deleteBooking(bookingId).then((success) => {
          if (success) location.reload();
        });
      }
    });
  });

  // ADMIN: DELETE REVIEW
  document.querySelectorAll('.btn-delete-review-admin').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { reviewId } = e.target.dataset;
      if (reviewId && confirm('Are you sure you want to delete this review?')) {
        deleteReviewAdmin(reviewId).then((success) => {
          if (success) location.reload();
        });
      }
    });
  });

  // DELETE MY ACCOUNT
  const deleteAccountBtn = document.querySelector('.btn-delete-account');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', (e) => {
      if (
        confirm(
          'Are you sure you want to delete your account? This action cannot be undone!',
        )
      ) {
        deleteMyAccount();
      }
    });
  }

  // SEARCH TOURS
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = document.getElementById('search');
      if (searchInput && searchInput.value.trim()) {
        window.location.href = `/?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

  // CONTACT FORM
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      if (name && email && subject && message) {
        submitContactForm(name, email, phone, subject, message);
      }
    });
  }

  // Show alert from URL params (e.g., after booking)
  const alertMessage = new URLSearchParams(window.location.search).get('alert');
  if (alertMessage === 'booking') {
    showAlert(
      'success',
      'Your booking was successful! Check your email for details.',
    );
    // Clean URL
    window.history.replaceState(null, '', window.location.pathname);
  }
});
