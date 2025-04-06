import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = ({ cartItems }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('success')) {
                alert('Payment Successful');
                navigate('/success');
            } else if (urlParams.get('canceled')) {
                alert('Payment Canceled');
                navigate('/cart');
            }
        };
        checkPaymentStatus();
    }, [navigate]);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/payment/create-checkout-session', { items: cartItems });
            window.location.href = data.id;
        } catch (error) {
            alert('Payment failed',error);
        }
        setLoading(false);
    };

    return (
        <button onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
    );
};

export default Checkout;
