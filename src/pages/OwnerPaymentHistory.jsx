import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { AuthContext } from '../context/authContext';
import { useLoading } from '../context/LoadingContext';

const OwnerPaymentHistory = () => {
  const { user } = useContext(AuthContext);
  // const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const [filter, setFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'verified', label: 'Verified' },
    { key: 'unverified', label: 'Unverified' },
  ];

  const filteredPayments = payments.filter((payment) => {
    let statusMatch = true;

    if (filter === 'verified') {
      statusMatch = payment.status === 'completed' && payment.verificationDate;
    } else if (filter === 'unverified') {
      statusMatch = payment.status === 'completed' && !payment.verificationDate;
    }

    const propertyMatch =
      selectedProperty === 'all' || payment.propertyId?._id === selectedProperty;

    return statusMatch && propertyMatch;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [paymentsRes, propertiesRes] = await Promise.all([
          API.get('/v1/rent-payments/my-properties-payments', { withCredentials: true }),
          API.get('/v1/properties/my-properties', { withCredentials: true }),
        ]);

        setPayments(paymentsRes.data.data.payments || []);
        setProperties(propertiesRes.data.data.properties || []);
      } catch (err) {
        toast.error('Failed to load payment history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading]);

  const handleVerifyPayment = async (paymentId) => {
    try {
      const res = await API.patch(
        `/v1/rent-payments/verify/${paymentId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.status === 'success') {
        toast.success('Payment verified successfully!');

        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === paymentId
              ? {
                  ...payment,
                  verifiedByOwnerId: user.id,
                  verificationDate: new Date().toISOString(),
                }
              : payment
          )
        );
      }
    } catch (err) {
      toast.error('Failed to verify payment');
      console.error(err);
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

  const groupPaymentsByProperty = () => {
    const grouped = {};
    filteredPayments.forEach((payment) => {
      const propertyId = payment.propertyId?._id || 'unknown';
      if (!grouped[propertyId]) {
        grouped[propertyId] = {
          property: payment.propertyId,
          payments: [],
        };
      }
      grouped[propertyId].payments.push(payment);
    });
    return grouped;
  };

  return (
    <>
      {!isLoading && (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-2 lg:px-4">
          <div className="max-w-7xl mx-auto backdrop-blur-lg p-2 sm:p-4 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3 pt-12 pb-8">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Payment Management Dashboard
              </h1>
              <p className="text-green-300 text-lg">
                Monitor and verify rent payments across all your properties
              </p>
            </div>

            {/* Quick Actions */}
            <section>
              <h2 className="text-2xl text-center font-semibold text-green-200 mb-4">
                Quick Actions
              </h2>
              <div className="flex justify-center items-center pb-8 mb-4">
                <div className="flex justify-center items-center gap-3">
                  {statusFilters.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setFilter(option.key)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        filter === option.key
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-green-200 hover:bg-white/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Payments Section */}
            <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8 space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-green-200">
                  Rent Payments ({filteredPayments.length})
                </h2>
              </div>

              {/* Property Filter Dropdown */}
              <div className="flex justify-center items-center gap-3 mb-6">
                <label className="text-green-200 font-medium">Select Property:</label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-green-200 border border-white/20 focus:outline-none"
                >
                  <option value="all">All Properties</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.title}
                    </option>
                  ))}
                </select>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-green-300 text-lg mb-4">
                    No payments found for selected property
                  </p>
                  <button
                    onClick={() => {
                      setFilter('all');
                      setSelectedProperty('all');
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.values(groupPaymentsByProperty()).map((group) => (
                    <div key={group.property?._id || 'unknown'}>
                      {/* Property Header */}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {group.property?.title || 'Unknown Property'}
                      </h3>
                      <p className="text-green-300 text-sm mb-4">
                        📍 {group.property?.address}, {group.property?.region},{' '}
                        {group.property?.city}
                      </p>

                      {/* Payments for this property */}
                      <div className="space-y-4">
                        {group.payments.map((payment) => {
                          const isCompleted = payment.status?.toLowerCase() === 'completed';
                          const isVerified = Boolean(payment.verificationDate);

                          return (
                            <div
                              key={payment._id}
                              className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/20 
                    rounded-2xl p-6 hover:ring-white/30 transition-all"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                {/* Tenant Info */}
                                {payment.tenantId && (
                                  <div className="flex-1">
                                    <p className="text-white">
                                      Sender:{' '}
                                      <span className="font-semibold text-green-300">
                                        {payment.tenantId.firstName} {payment.tenantId.lastName}
                                      </span>
                                    </p>
                                  </div>
                                )}

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
                                    {payment.verificationDate && (
                                      <p className="text-white">
                                        Verified:{' '}
                                        <span className="text-green-300">
                                          {formatDate(payment.verificationDate)}
                                        </span>
                                      </p>
                                    )}
                                  </div>

                                  {!isVerified && (
                                    <button
                                      onClick={() => handleVerifyPayment(payment._id)}
                                      className="mt-3 w-full lg:w-auto bg-green-600 hover:bg-green-700 
                            text-white text-sm font-medium py-2 px-4 rounded-lg transition"
                                    >
                                      Verify Payment
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Summary Stats */}
            {payments.length > 0 && (
              <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-green-200 mb-6">Overall Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{payments.length}</div>
                    <div className="text-green-300">Total Payments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {payments.filter((p) => p.verificationDate).length}
                    </div>
                    <div className="text-green-300">Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {
                        payments.filter((p) => p.status === 'completed' && !p.verificationDate)
                          .length
                      }
                    </div>
                    <div className="text-green-300">Pending Verification</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{properties.length}</div>
                    <div className="text-green-300">Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      PKR {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-green-300">Total Revenue</div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default OwnerPaymentHistory;

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import API from '../api/axios';
// import { AuthContext } from '../context/AuthContext';
// import { useLoading } from '../context/LoadingContext';

// const OwnerPaymentHistory = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [payments, setPayments] = useState([]);
//   const [properties, setProperties] = useState([]);
//   const { isLoading, setIsLoading } = useLoading();
//   const [filter, setFilter] = useState('all');
//   const [selectedProperty, setSelectedProperty] = useState('all');

//   const statusFilters = [
//     { key: 'all', label: 'All' },
//     { key: 'verified', label: 'Verified' },
//     { key: 'unverified', label: 'Unverified' },
//   ];

//   const filteredPayments = payments.filter((payment) => {
//     let statusMatch = true;

//     if (filter === 'verified') {
//       statusMatch = payment.status === 'completed' && payment.verificationDate;
//     } else if (filter === 'unverified') {
//       statusMatch = payment.status === 'completed' && !payment.verificationDate;
//     }

//     const propertyMatch =
//       selectedProperty === 'all' || payment.propertyId?._id === selectedProperty;

//     return statusMatch && propertyMatch;
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         // Fetch owner's payment history and properties in parallel
//         const [paymentsRes, propertiesRes] = await Promise.all([
//           API.get('/v1/rent-payments/my-properties-payments', { withCredentials: true }),
//           API.get('/v1/properties/my-properties', { withCredentials: true }),
//         ]);

//         setPayments(paymentsRes.data.data.payments || []);
//         setProperties(propertiesRes.data.data.properties || []);
//       } catch (err) {
//         toast.error('Failed to load payment history');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [setIsLoading]);

//   const handleVerifyPayment = async (paymentId) => {
//     try {
//       const res = await API.patch(
//         `/v1/rent-payments/verify/${paymentId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.data.status === 'success') {
//         toast.success('Payment verified successfully!');

//         // Update the payment in the local state
//         setPayments((prevPayments) =>
//           prevPayments.map((payment) =>
//             payment._id === paymentId
//               ? {
//                   ...payment,
//                   verifiedByOwnerId: user.id,
//                   verificationDate: new Date().toISOString(),
//                 }
//               : payment
//           )
//         );
//       }
//     } catch (err) {
//       toast.error('Failed to verify payment');
//       console.error(err);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
//     switch (status) {
//       case 'completed':
//         return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
//       case 'pending':
//         return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
//       case 'failed':
//         return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
//       case 'overdue':
//         return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
//       default:
//         return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const formatCurrency = (amount, currency = 'PKR') => {
//     return `${currency} ${amount.toLocaleString()}`;
//   };

//   const groupPaymentsByProperty = () => {
//     const grouped = {};
//     filteredPayments.forEach((payment) => {
//       const propertyId = payment.propertyId?._id || 'unknown';
//       if (!grouped[propertyId]) {
//         grouped[propertyId] = {
//           property: payment.propertyId,
//           payments: [],
//         };
//       }
//       grouped[propertyId].payments.push(payment);
//     });
//     return grouped;
//   };

//   const groupedPayments = groupPaymentsByProperty();

//   return (
//     <>
//       {!isLoading && (
//         <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-2 lg:px-4">
//           <div className="max-w-7xl mx-auto backdrop-blur-lg p-2 sm:p-4 space-y-6">
//             {/* Header */}
//             <div className="text-center space-y-3 pt-12 pb-8">
//               <h1 className="text-2xl font-extrabold text-white tracking-tight">
//                 Payment Management Dashboard
//               </h1>
//               <p className="text-green-300 text-lg">
//                 Monitor and verify rent payments across all your properties
//               </p>
//             </div>

//             {/* Quick Actions */}
//             <section className="">
//               <h2 className="text-2xl text-center font-semibold text-green-200 mb-4">
//                 Quick Actions
//               </h2>
//               <div className="flex justify-center items-center pb-8 mb-4">
//                 <div className="flex justify-center items-center gap-3">
//                   {statusFilters.map((option) => (
//                     <button
//                       key={option.key}
//                       onClick={() => setFilter(option.key)}
//                       className={`px-4 py-2 rounded-lg font-medium transition ${
//                         filter === option.key
//                           ? 'bg-green-500 text-white'
//                           : 'bg-white/10 text-green-200 hover:bg-white/20'
//                       }`}
//                     >
//                       {option.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </section>

//             {/* Payments Section */}
//             <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-semibold text-green-200">
//                   Rent Payments ({filteredPayments.length})
//                 </h2>
//               </div>

//               {filteredPayments.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-6xl mb-4">📊</div>
//                   <p className="text-green-300 text-lg mb-4">
//                     No payments found matching your filters
//                   </p>
//                   <button
//                     onClick={() => {
//                       setFilter('all');
//                       setSelectedProperty('all');
//                     }}
//                     className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredPayments.map((payment) => {
//                     const isCompleted = payment.status?.toLowerCase() === 'completed';
//                     const isVerified = Boolean(payment.verificationDate);

//                     return (
//                       <div
//                         key={payment._id}
//                         className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/20
//           rounded-2xl p-6 hover:ring-white/30 transition-all"
//                       >
//                         <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                           {/* Property Info */}
//                           <div className="flex-1">
//                             <h3 className="text-xl font-bold text-white mb-2">
//                               {payment.propertyId?.title || 'Property Title'}
//                             </h3>
//                             <p className="text-green-300 text-sm mb-1">
//                               📍{' '}
//                               {`${payment.propertyId?.address},
//                                 ${payment.propertyId?.region},
//                                 ${payment.propertyId?.city}` || 'Unknown Address'}
//                             </p>

//                             {/* ✅ Sender Info */}
//                             {payment.tenantId && (
//                               <div className="mt-3 text-sm text-white">
//                                 <p>
//                                   Sender:{' '}
//                                   <span className="font-semibold text-green-300">
//                                     {payment.tenantId.firstName} {payment.tenantId.lastName}
//                                   </span>
//                                 </p>
//                                 {/* <p>📧 {payment.tenantId.email}</p>
//                                 <p>📱 {payment.tenantId.phoneNumber}</p> */}
//                               </div>
//                             )}
//                           </div>

//                           {/* Payment Details */}
//                           <div className="flex gap-x-8 justify-between items-center">
//                             <div>
//                               <span className="text-white text-sm">Amount:</span>
//                               <p className="text-green-300 font-semibold text-lg">
//                                 {formatCurrency(payment.amount, payment.currency)}
//                               </p>
//                             </div>
//                             <div>
//                               <span className="text-white text-sm">Due Date:</span>
//                               <p className="text-green-300 text-sm">
//                                 {formatDate(payment.dueDate)}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Status & Actions */}
//                           <div className="flex-1 text-center lg:text-right">
//                             <div className="mb-3">
//                               <span className={getStatusBadge(payment.status)}>
//                                 {payment.status.toUpperCase()}
//                               </span>
//                             </div>

//                             <div className="space-y-1 text-sm text-white">
//                               <p>
//                                 Paid:{' '}
//                                 <span className="text-green-300">
//                                   {formatDate(payment.paymentDate)}
//                                 </span>
//                               </p>
//                               {payment.verificationDate && (
//                                 <p className="text-white">
//                                   Verified:{' '}
//                                   <span className="text-green-300">
//                                     {formatDate(payment.verificationDate)}
//                                   </span>
//                                 </p>
//                               )}

//                               {!isCompleted && payment.transactionId && (
//                                 <p className="text-xs text-gray-400 break-all">
//                                   TXN: {payment.transactionId}
//                                 </p>
//                               )}
//                             </div>

//                             {/* ✅ Show Verify button if NOT verified */}
//                             {!isVerified && (
//                               <button
//                                 onClick={() => handleVerifyPayment(payment._id)}
//                                 className="mt-3 w-full lg:w-auto bg-green-600 hover:bg-green-700
//                   text-white text-sm font-medium py-2 px-4 rounded-lg transition focus:ring-2 focus:ring-green-400"
//                               >
//                                 Verify Payment
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </section>

//             {/* Summary Stats */}
//             {payments.length > 0 && (
//               <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8">
//                 <h2 className="text-2xl font-semibold text-green-200 mb-6">Overall Summary</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-white">{payments.length}</div>
//                     <div className="text-green-300">Total Payments</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-green-400">
//                       {payments.filter((p) => p.verificationDate).length}
//                     </div>
//                     <div className="text-green-300">Verified</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-yellow-400">
//                       {
//                         payments.filter((p) => p.status === 'completed' && !p.verificationDate)
//                           .length
//                       }
//                     </div>
//                     <div className="text-green-300">Pending Verification</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-blue-400">{properties.length}</div>
//                     <div className="text-green-300">Properties</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-white">
//                       PKR {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
//                     </div>
//                     <div className="text-green-300">Total Revenue</div>
//                   </div>
//                 </div>
//               </section>
//             )}
//           </div>
//         </main>
//       )}
//     </>
//   );
// };

// export default OwnerPaymentHistory;
