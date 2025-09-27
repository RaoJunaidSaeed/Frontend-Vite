import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { AuthContext } from '../context/authContext';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51QooBpIM1ODNnTet8Oy080z4orKQvOCWxbcws4bWmjN0JWxoNFDk49jDgwsOUhbqX6sgsWEg2ZZ0xDd19d1rbk6k00FLeF1l04'
);

function RentPaymentForm({ property }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cardholderName, setCardholderName] = useState('');
  const [paymentPeriod, setPaymentPeriod] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate current month as default payment period
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    setPaymentPeriod(currentMonth);

    // Set due date to end of current month
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    setDueDate(lastDay.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      setIsProcessing(true);

      // 1. Create payment intent (Stripe)
      const { data } = await API.post(
        '/v1/rent-payments/create-payment-intent',
        {
          propertyId: property._id, // REQUIRED
          amount: property.rentAmount, // REQUIRED
          currency: property.currency || 'PKR',
          paymentPeriod, // REQUIRED
          dueDate: new Date(dueDate).toISOString(), // REQUIRED
        },
        { withCredentials: true }
      );

      const clientSecret = data?.clientSecret;
      if (!clientSecret) {
        toast.error('Failed to create payment intent');
        return;
      }

      // 2. Confirm payment on Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: cardholderName || `${user?.firstName} ${user?.lastName}`,
          },
        },
      });

      if (result.error) {
        toast.error(`Payment failed: ${result.error.message}`);
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        const transactionId = result.paymentIntent.id;
        const amount = result.paymentIntent.amount / 100;

        // 3. Record rent payment in DB
        const res = await API.post(
          '/v1/rent-payments/initiate',
          {
            propertyId: property._id,
            amount,
            paymentPeriod,
            dueDate: new Date(dueDate).toISOString(),
            transactionId,
          },
          { withCredentials: true }
        );

        if (res.data.status === 'success') {
          toast.success('✅ Rent payment successful!');
          navigate('/tenant-payment-history');
        } else {
          toast.warning('Payment succeeded but could not be recorded in DB.');
        }
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('already exists')) {
        toast.error('Payment for this period already exists');
      } else {
        toast.error('Unexpected error: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsProcessing(false);
    }

    // try {
    //   // Create payment intent for rent payment
    //   const { data } = await API.post(
    //     '/v1/rent-payments/create-payment-intent',
    //     {
    //       amount: property.rentAmount,
    //       currency: property.currency || 'PKR',
    //       description: `Rent payment for ${property.title} - ${paymentPeriod}`,
    //     },
    //     { withCredentials: true }
    //   );

    //   const clientSecret = data?.clientSecret;
    //   if (!clientSecret) return toast.error('Failed to create payment intent');

    //   // Confirm payment on Stripe
    //   const result = await stripe.confirmCardPayment(clientSecret, {
    //     payment_method: {
    //       card: elements.getElement(CardNumberElement),
    //       billing_details: {
    //         name: cardholderName || `${user?.firstName} ${user?.lastName}`,
    //       },
    //     },
    //   });

    //   if (result.error) {
    //     toast.error(`Payment failed: ${result.error.message}`);
    //   } else if (result.paymentIntent.status === 'succeeded') {
    //     const transactionId = result.paymentIntent.id;
    //     const amount = result.paymentIntent.amount / 100;

    //     // Record rent payment
    //     const res = await API.post(
    //       '/v1/rent-payments/initiate',
    //       {
    //         propertyId: property._id,
    //         amount,
    //         paymentPeriod,
    //         dueDate: new Date(dueDate).toISOString(),
    //         transactionId,
    //       },
    //       { withCredentials: true }
    //     );

    //     if (res.data.status === 'success') {
    //       toast.success('✅ Rent payment successful!');
    //       navigate('/tenant-payment-history');
    //     } else {
    //       toast.warning('Payment succeeded but recording failed.');
    //     }
    //   }
    // } catch (err) {
    //   if (err.response?.data?.message?.includes('already exists')) {
    //     toast.error('Payment for this period already exists');
    //   } else {
    //     toast.error('Unexpected error: ' + (err.response?.data?.message || err.message));
    //   }
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  const elementStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1A202C',
        '::placeholder': { color: '#A0AEC0' },
      },
      invalid: { color: '#E53E3E' },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-8 sm:p-10 space-y-6 shadow-2xl"
    >
      <h2 className="text-3xl font-extrabold text-white text-center">
        Pay Rent for {property.title}
      </h2>
      <p className="text-center text-green-200 text-lg">
        Pay <strong>Rs {property.rentAmount}</strong> for <strong>{paymentPeriod}</strong>
      </p>

      {/* Payment Period */}
      <div>
        <label className="text-sm text-green-200 block mb-1">Payment Period</label>
        <input
          type="text"
          required
          value={paymentPeriod}
          onChange={(e) => setPaymentPeriod(e.target.value)}
          placeholder="e.g. January 2025"
          className="w-full bg-white/10 text-white px-4 py-3 rounded-md border border-white/20 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="text-sm text-green-200 block mb-1">Due Date</label>
        <input
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-white/10 text-white px-4 py-3 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="text-sm text-green-200 block mb-1">Cardholder Name</label>
        <input
          type="text"
          required
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder={`${user?.firstName} ${user?.lastName}` || 'Enter cardholder name'}
          className="w-full bg-white/10 text-white px-4 py-3 rounded-md border border-white/20 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Card Number */}
      <div>
        <label className="text-sm text-green-200 block mb-1">Card Number</label>
        <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
          <CardNumberElement options={elementStyle} />
        </div>
      </div>

      {/* Expiry / CVC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-green-200 block mb-1">Expiry</label>
          <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
            <CardExpiryElement options={elementStyle} />
          </div>
        </div>
        <div>
          <label className="text-sm text-green-200 block mb-1">CVC</label>
          <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
            <CardCvcElement options={elementStyle} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay Rs ${property.rentAmount}`}
      </button>
    </form>
  );
}

export default function TenantRentPayment() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // v1/properties/68a35549972a4825529e158a

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/v1/properties/${propertyId}`, {
          withCredentials: true,
        });
        // console.log(res.data.data.data);
        setProperty(res.data.data.data);
      } catch (err) {
        toast.error('Failed to load property details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-6 sm:px-8 lg:px-16 flex items-center justify-center">
        <p className="text-center text-green-200 text-lg">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-6 sm:px-8 lg:px-16 flex items-center justify-center">
        <p className="text-center text-red-300 text-lg">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-6 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Property Info */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-white">Rent Payment</h1>
          <div className="bg-white/10 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              {property.images?.length > 0 && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">{property.title}</h3>
                <p className="text-green-300">
                  {property.city}, {property.region}
                </p>
                <p className="text-green-200">Monthly Rent: Rs {property.rentAmount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <Elements stripe={stripePromise}>
          <RentPaymentForm property={property} />
        </Elements>
      </div>
    </div>
  );
}
