/* eslint-disable */
import { showAlert } from './alert.js';

export const submitContactForm = async (
  name,
  email,
  phone,
  subject,
  message,
) => {
  try {
    // For now, just show success message
    // In production, this would send to a backend endpoint
    showAlert(
      'success',
      'Thank you for your message! We will get back to you soon.',
    );

    // Clear the form
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';

    return true;
  } catch (err) {
    showAlert('error', 'Failed to send message. Please try again.');
    return false;
  }
};
