/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert.js';
import { loadStripe } from '@stripe/stripe-js'; // ✅ safer import

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      'pk_test_51Rjz1DQQ6cqDfk6E32GAigxNV7SilUozSE6SGiEBwsy0y3qjesSMGXKxeh8Sef89vSwXVTXK5l8s9sXREvifqx6M00PMEE6Mf2',
    );
  }
  return stripePromise;
};

export const bookTour = async (tourId) => {
  try {
    const stripe = await getStripe(); // ✅ loaded asynchronously

    // 1) Get Checkout session from API
    const session = await axios(`/api/v1/booking/checkOut-session/${tourId}`);

    // 2) Redirect to Stripe checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.message);
  }
};
