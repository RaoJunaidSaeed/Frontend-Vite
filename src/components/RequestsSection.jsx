import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { Home, Calendar, User } from 'lucide-react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';

const statusOptions = [
  // { value: 'pending', label: '⏳ Pending' },
  { value: 'approved', label: '✅ Approve' },
  { value: 'rejected', label: '❌ Reject' },
];

const RequestsSection = () => {
  const [requests, setRequests] = useState([]);
  const location = useLocation();

  // Scroll to this section if URL contains #requests
  useEffect(() => {
    const scrollToSection = () => {
      if (location.hash === '#requests') {
        const element = document.getElementById('requests');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const timeout = setTimeout(scrollToSection, 300); // Delay to ensure render
    return () => clearTimeout(timeout);
  }, [location]);

  // Fetch bookings
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get('/v1/bookings/my-bookings', {
          withCredentials: true,
        });
        setRequests(res.data.data.bookings || []);
      } catch (err) {
        toast.error('Failed to fetch booking requests');
      }
    };

    fetchRequests();
  }, []);

  const handleRequestAction = async (id, status) => {
    try {
      const endpoint =
        status === 'approved'
          ? `/v1/bookings/approveBooking/${id}`
          : `/v1/bookings/rejectBooking/${id}`;

      await API.patch(endpoint, {}, { withCredentials: true });

      toast.success(`Status updated to "${status}"`);

      // ✅ Immediately update local state
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status, newStatus: undefined } : req))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking status');
      console.error(err);
    }
  };

  return (
    <div
      // id="requests"
      className=" w-full min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-2 lg:px-4"
    >
      <h2 className="text-3xl font-extrabold text-white text-center pb-6">Booking Requests</h2>

      {requests.length === 0 ? (
        <p className="text-green-300 text-center text-lg">No booking requests found.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/10 rounded-xl p-6 shadow-lg hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-green-100 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  {req.propertyId?.title || 'Untitled Property'}
                </h3>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full capitalize tracking-wide ${
                    req.status === 'approved'
                      ? 'bg-green-500/20 text-green-300'
                      : req.status === 'rejected'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-yellow-400/20 text-yellow-300'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-green-200">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-300" />
                  Tenant: {req.tenantId?.firstName} {req.tenantId?.lastName}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-300" />
                  Move-in Date: {new Date(req.desiredMoveInDate).toLocaleDateString()}
                </p>
                <p>
                  Lease Duration: <strong>{req.desiredLeaseDuration}</strong>
                </p>

                {req.status === 'approved' && req.tenantId && (
                  <div className="space-y-1 text-green-200">
                    <p>
                      <strong>Email:</strong> {req.tenantId.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {req.tenantId.phoneNumber}
                    </p>
                  </div>
                )}
              </div>

              {req.messageFromTenant && (
                <p className="mt-4 text-green-300 italic">"{req.messageFromTenant}"</p>
              )}

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-64">
                  <Select
                    value={statusOptions.find((opt) => opt.value === (req.newStatus || req.status))}
                    onChange={(selectedOption) =>
                      setRequests((prev) =>
                        prev.map((r) =>
                          r._id === req._id ? { ...r, newStatus: selectedOption.value } : r
                        )
                      )
                    }
                    options={statusOptions}
                    className="text-sm"
                    menuPortalTarget={document.body}
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: '2px',
                        minHeight: '40px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: '#d1fae5',
                        borderRadius: '0.5rem',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#d1fae5',
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#f8f8f8ff',
                        color: '#363736ff',
                        borderRadius: '0.5rem',
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>
                <button
                  onClick={() => handleRequestAction(req._id, req.newStatus || req.status)}
                  disabled={!req.newStatus || req.newStatus === req.status}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-400"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsSection;
