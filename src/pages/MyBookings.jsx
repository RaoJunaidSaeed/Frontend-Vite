import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import { AuthContext } from '../context/authContext';
import { generateLeaseAgreementPDF } from '../utils/leaseAgreementPDF';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [alreadyPaidRent, setAlreadyPaidRent] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isLoading, setIsLoading } = useLoading();

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await API.get('/v1/bookings/my-bookings', {
          withCredentials: true,
        });
        setBookings(res.data.data.bookings || []);
      } catch (err) {
        toast.error('Failed to load your bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [setIsLoading]);

  // Fetch payment statuses for all bookings
  useEffect(() => {
    const fetchPayments = async () => {
      if (!bookings.length) return;

      const paidStatus = {};

      for (const booking of bookings) {
        try {
          const res = await API.get(`/v1/rent-payments/my-payments/${booking.propertyId._id}`, {
            withCredentials: true,
          });

          const payment = res.data?.data?.payment;
          paidStatus[booking._id] = payment && payment.status === 'completed';
        } catch (err) {
          console.error(`Payment check failed for property ${booking.propertyId._id}:`, err);
          paidStatus[booking._id] = false;
        }
      }

      setAlreadyPaidRent(paidStatus);
    };

    fetchPayments();
  }, [bookings]);

  // Handle Rent Payment
  const handlePayRent = (propertyId) => {
    if (!propertyId) {
      toast.error('Property ID not found!');
      return;
    }
    navigate(`/rent-payment/${propertyId}`);
  };

  // Capitalize helper
  const capitalize = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <>
      {!isLoading && (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto backdrop-blur-lg p-3 sm:p-12 space-y-10">
            <h1 className="text-3xl font-extrabold text-white text-center pt-3 mb-4">
              My Bookings
            </h1>

            {bookings.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">You have no booking requests yet.</p>
            ) : (
              <div className="space-y-8">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/20 rounded-xl p-6 sm:p-8 transition-transform transform hover:-translate-y-1 hover:shadow-xl text-green-100"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
                      {/* Booking Info */}
                      <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-bold text-white">
                          {booking.propertyId?.title || 'Untitled Property'}
                        </h2>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span
                            className={`font-semibold ${
                              booking.status === 'approved'
                                ? 'text-green-400'
                                : booking.status === 'pending'
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            {capitalize(booking.status)}
                          </span>
                        </p>
                        <p>
                          <strong>Move-in Date:</strong>{' '}
                          {new Date(booking.desiredMoveInDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Lease Duration:</strong>{' '}
                          {capitalize(booking.desiredLeaseDuration)}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button
                            onClick={() =>
                              booking?.propertyId?._id
                                ? navigate(`/property/${booking.propertyId._id}`)
                                : toast.error('Property not found!')
                            }
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition focus:ring-2 focus:ring-green-400"
                          >
                            Review Property
                          </button>

                          {/* Rent Payment Button */}
                          {user &&
                            user.role === 'tenant' &&
                            booking.status === 'approved' &&
                            booking.propertyId && (
                              <button
                                disabled={alreadyPaidRent[booking._id]}
                                onClick={() => handlePayRent(booking.propertyId._id)}
                                className={`px-6 py-2 rounded-lg font-medium transition ${
                                  alreadyPaidRent[booking._id]
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-900 hover:bg-blue-600 text-white'
                                }`}
                              >
                                {alreadyPaidRent[booking._id] ? 'Rent Paid' : 'Pay Rent'}
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Owner Info */}
                      {booking.ownerId && (
                        <div className="flex-1 bg-white/10 ring-1 ring-white/10 rounded-xl p-6 space-y-2">
                          <h3 className="text-xl font-bold text-white">Owner Information</h3>
                          <p>
                            <strong>Name:</strong> {capitalize(booking.ownerId.firstName)}{' '}
                            {capitalize(booking.ownerId.lastName)}
                          </p>

                          {booking.status === 'approved' ? (
                            <>
                              <p>
                                <strong>Phone:</strong>{' '}
                                <span className="text-white">{booking.ownerId.phoneNumber}</span>
                              </p>
                              <p>
                                <strong>Email:</strong>{' '}
                                <span className="text-white">{booking.ownerId.email}</span>
                              </p>

                              <button
                                onClick={() => generateLeaseAgreementPDF(booking, user)}
                                className=" w-full sm:w-auto sm:self-start bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition focus:ring-2 focus:ring-green-400"
                              >
                                Get Lease Agreement
                              </button>
                            </>
                          ) : (
                            <p className="text-yellow-300 italic mt-2">
                              Contact info will be visible after approval. Please wait for
                              confirmation.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default MyBookings;
