import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { AuthContext } from '../context/authContext';
import { useLoading } from '../context/LoadingContext';
import { generatePDF } from '../utils/pdfGenerator';

const TenantPaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const [filter, setFilter] = useState('all');
  const [pdfFilter, setPdfFilter] = useState('monthly');

  // const filteredPayments =
  //   filter === 'all' ? payments : payments.filter((payment) => payment.status === filter);
  const filteredPayments = payments.filter((payment) => {
    if (filter === 'all') return true;

    if (filter === 'verified') {
      return Boolean(payment.verificationDate);
    }

    if (filter === 'unverified') {
      return !payment.verificationDate;
    }

    return payment.status === filter;
  });

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true);
        const res = await API.get('/v1/rent-payments/my-payments', { withCredentials: true });
        setPayments(res.data.data.payments || []);
      } catch (err) {
        toast.error('Failed to load payment history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [setIsLoading]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      case 'overdue':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case 'failed':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      case 'overdue':
        return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount, currency = 'PKR') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <>
      {!isLoading && (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-2 lg:px-4">
          <div className="max-w-7xl mx-auto backdrop-blur-lg p-2 sm:p-4 space-y-6">
            {/* Payment History Heading */}
            <div className="text-center pt-12 pb-4">
              <h1 className="text-3xl font-extrabold text-white pb-4 tracking-tight">
                Payment History
              </h1>
              <p className="text-green-300 text-lg ">
                Track all your rent payments and their status
              </p>
            </div>

            {/* Filter Section */}
            <section className="px-3 sm:p-4 space-y-6">
              <div className="flex flex-wrap justify-center gap-1 py-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'completed', label: 'Completed' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'overdue', label: 'Overdue' },
                  { key: 'verified', label: 'Verified' },
                  { key: 'unverified', label: 'Unverified' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-2 rounded-full font-medium uppercase text-sm tracking-wide transition ${
                      filter === f.key
                        ? 'bg-green-600 text-white'
                        : 'bg-white/10 text-green-200 hover:bg-white/20'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Payments Section */}
            <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-3 sm:p-8 space-y-6">
              <div className="">
                <h2 className="text-2xl text-center font-extrabold text-white pt-6 pb-4">
                  Your Rent Payments
                </h2>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💳</div>
                  <p className="text-green-300 text-lg mb-4">
                    {filter === 'all' ? 'No payment history found' : `No ${filter} payments found`}
                  </p>
                  <button
                    onClick={() => navigate('/tenant-dashboard')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Browse Properties
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => {
                    const isCompleted = payment.status?.toLowerCase() === 'completed';

                    return (
                      <div
                        key={payment._id}
                        className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/20 
                   rounded-2xl p-6 hover:ring-white/30 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                          {/* Property Info */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {payment.propertyId?.title || 'Property Title'}
                            </h3>
                            <p className="text-green-300 text-sm mb-1">
                              📍{' '}
                              {`${payment.propertyId?.address},
                                ${payment.propertyId?.region},
                                ${payment.propertyId?.city}` || 'Unknown Address'}
                            </p>
                          </div>

                          {/* Payment Details */}
                          <div className="flex gap-x-8 justify-between items-center">
                            <div>
                              <span className="text-white text-sm">Amount:</span>
                              <p className="text-green-300 font-semibold text-lg">
                                {formatCurrency(payment.amount, payment.currency)}
                              </p>
                            </div>
                            <div>
                              <span className="text-white text-sm">Due Date:</span>
                              <p className="text-green-300 text-sm">
                                {formatDate(payment.dueDate)}
                              </p>
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex-1 text-center lg:text-right">
                            <div className="mb-3">
                              <span className={getStatusBadge(payment.status)}>
                                {payment.status.toUpperCase()}
                              </span>
                            </div>

                            <div className="space-y-1 text-sm text-white">
                              <p>
                                Paid:{' '}
                                <span className="text-green-300">
                                  {formatDate(payment.paymentDate)}
                                </span>
                              </p>
                              {payment.verificationDate ? (
                                <p className="text-white">
                                  Verified:{' '}
                                  <span className="text-green-300">
                                    {formatDate(payment.verificationDate)}
                                  </span>
                                </p>
                              ) : (
                                <p className="text-white">Not Verified Yet</p>
                              )}

                              {/* Only show TXN if not completed */}
                              {!isCompleted && payment.transactionId && (
                                <p className="text-xs text-gray-400 break-all">
                                  TXN: {payment.transactionId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Summary Stats */}
            {payments.length > 0 && (
              <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-green-200 mb-6">Payment Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{payments.length}</div>
                    <div className="text-green-300">Total Payments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {payments.filter((p) => p.status === 'completed').length}
                    </div>
                    <div className="text-green-300">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {payments.filter((p) => p.status === 'pending').length}
                    </div>
                    <div className="text-green-300">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      PKR {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </div>
                    <div className="text-green-300">Total Amount</div>
                  </div>
                </div>
              </section>
            )}

            <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-2 sm:p-8 space-y-6">
              <h1 className="text-2xl text-center font-extrabold text-white pb-4 tracking-tight">
                Download Payment Statement
              </h1>
              <div className="flex justify-center items-center gap-8">
                {/* Select dropdown */}
                <select
                  value={pdfFilter}
                  onChange={(e) => setPdfFilter(e.target.value)}
                  className=" border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>

                {/* Download button */}
                <button
                  onClick={() => generatePDF(payments, user, pdfFilter)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-bold transition"
                >
                  Download
                </button>
              </div>
            </section>
          </div>
        </main>
      )}
    </>
  );
};

export default TenantPaymentHistory;
