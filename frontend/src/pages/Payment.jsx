import { useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/payment/create-session', {
        amount: 10,
        currency: 'usd',
      });
      window.location.href = data.id;
    } catch (error) {
      alert('Payment failed',error);
    }
    setLoading(false);
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Subscribe Now'}
    </button>
  );
};

export default Payment;
