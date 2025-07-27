/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';
import { signup } from './signup.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.form--login');
  const signupForm = document.querySelector('.form--signup');
  const logOutBtn = document.querySelector('.nav__el--logout');
  const userDataForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-password');
  const bookBtn = document.getElementById('book-tour');

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
});
