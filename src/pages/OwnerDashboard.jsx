import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import { AuthContext } from '../context/authContext';
// import RequestsSection from '../components/RequestsSection';
// import { useLocation } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const OwnerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { isLoading, setIsLoading } = useLoading();

  const filteredProperties =
    filter === 'all'
      ? myProperties
      : myProperties.filter((property) => property.availabilityStatus?.toLowerCase() === filter);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [plansRes, propertiesRes, activePlanRes] = await Promise.all([
          API.get('/v1/plans', { withCredentials: true }),
          API.get('/v1/properties/my-properties', { withCredentials: true }),
          API.get('/v1/plans/active', { withCredentials: true }),
        ]);

        setPlans(plansRes.data.data.plans);
        setMyProperties(propertiesRes.data.data.properties);
        setActivePlan(activePlanRes.data.data.plan || null);
      } catch (err) {
        toast.error('Failed to load data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPlan = (planId) => {
    navigate(`/payment/${planId}`);
  };

  const handleAddProperty = () => {
    if (myProperties.length >= activePlan?.maxListings) {
      toast.warning('You have reached your plan’s listing limit.');
    } else {
      navigate('/add-property');
    }
  };

  return (
    <>
      {!isLoading && (
        <main className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-2 lg:px-4">
          {/* <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl shadow-2xl p-2 sm:p-4 space-y-6"> */}
          <div className="max-w-7xl mx-auto backdrop-blur-lg p-2 sm:p-4 space-y-6">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight pt-8 pb-2">
                Welcome, {user?.firstName}
              </h1>
              <p className="text-lg text-green-300 pt-2">
                Manage your properties and subscription plan here.
              </p>
            </div>
            {!activePlan ? (
              // No Active Plan Section
              <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-8">
                <p className="text-center text-green-200 mb-8">
                  You don't have any active subscription plan. Please select one to start listing
                  properties.
                </p>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {plans.map((plan) => (
                    <div
                      key={plan._id}
                      className="group bg-white/5 backdrop-blur-md ring-1 ring-white/20 rounded-2xl p-8 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-green-300 mb-4">
                          <span className="text-xl font-extrabold text-white">Rs {plan.price}</span>{' '}
                          / {plan.durationDays} days
                        </p>
                        <ul className="space-y-2 text-green-200 text-sm">
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                          <li>Max Listings: {plan.maxListings}</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleSelectPlan(plan._id)}
                        className="mt-6 w-full bg-gradient-to-r from-primary to-secondary hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                      >
                        Select Plan
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <>
                {/* Add Property Button */}
                <div className="text-center pt-2">
                  <button
                    onClick={handleAddProperty}
                    disabled={myProperties.length >= activePlan?.maxListings}
                    className={`inline-flex items-center justify-center w-full max-w-sm py-3 px-6 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 ${
                      myProperties.length >= activePlan?.maxListings
                        ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    + Add New Property
                  </button>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 py-2">
                  {['all', 'available', 'rented', 'pending'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-5 py-2 rounded-full font-medium uppercase text-sm tracking-wide transition ${
                        filter === status
                          ? 'bg-green-600 text-white'
                          : 'bg-white/10 text-green-200 hover:bg-white/20'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Property Listings */}
                <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-3">
                  <h2 className="text-2xl font-bold text-white text-center py-6">
                    Your Listed Properties
                  </h2>

                  {filteredProperties.length === 0 ? (
                    <p className="text-gray-400 text-center">
                      No properties match the selected filter.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProperties.map((property) => (
                        <div
                          key={property._id}
                          className="group  backdrop-blur-md ring-1 ring-white/20 rounded-2xl overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
                        >
                          {property.images?.[0] && (
                            <div className="relative h-56 overflow-hidden">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-6 text-green-50">
                            <h3 className="text-xl font-bold mb-1">{property.title}</h3>
                            <p className="text-sm text-green-200">
                              {property.city}, {property.region}
                            </p>
                            <div className="mt-2 flex items-baseline">
                              <span className="text-lg font-extrabold text-white">
                                Rs {property.rentAmount}
                              </span>
                              {/* <span className="text-sm text-green-200">/ {property.currency}</span> */}
                            </div>
                            <p className="mt-2 text-sm">
                              Status:{' '}
                              <span className={`font-semibold text-green-400`}>
                                {property.availabilityStatus}
                              </span>
                            </p>
                            <div className="flex justify-between items-center mt-3">
                              {property.isVerified ? (
                                <span className="inline-block  px-3 py-1 text-xs bg-green-500 text-white rounded-full">
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-block  px-3 py-1 text-xs bg-green-500 text-white rounded-full">
                                  Unverified
                                </span>
                              )}
                              <button
                                onClick={() => navigate(`/property/${property._id}`)}
                                className=" bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                              >
                                Review Property
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Current Plan */}
                <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-3">
                  <h2 className="text-2xl font-bold text-white text-center pb-6">
                    Your Current Subscription
                  </h2>

                  <div className="space-y-6 text-green-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <h3 className="text-2xl font-semibold">{activePlan.name}</h3>
                      <p className="text-lg text-white">
                        Rs {activePlan.price} / {activePlan.durationDays} days
                      </p>
                    </div>
                    <p>
                      Max Listings:{' '}
                      <span className="font-semibold text-white">{activePlan.maxListings}</span> |
                      Used: <span className="font-semibold text-white">{myProperties.length}</span>
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${Math.min(
                            (myProperties.length / activePlan.maxListings) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Features Included:</h4>
                      <ul className="list-disc list-inside text-sm text-green-200 space-y-1">
                        {activePlan.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Request Section */}
                {/* <RequestsSection /> */}
              </>
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default OwnerDashboard;
