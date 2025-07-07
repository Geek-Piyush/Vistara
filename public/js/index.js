/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login } from './login';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  if (!form) {
    console.warn('⚠️ .form not found on this page');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
});
