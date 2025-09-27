import { useState, useContext } from 'react';
import {
  Menu,
  X,
  User,
  MessageCircle,
  CreditCard,
  ClipboardList,
  LogOut as LogOutIcon,
  ArrowLeft,
  LayoutDashboard,
  Inbox,
  Receipt,
} from 'lucide-react';
import { AuthContext } from '../context/authContext';
import HelpSupportChat from '../components/HelpSupportChat';
import UserProfile from '../pages/UserProfile';
import { useNavigate } from 'react-router-dom';
import OwnerDashboard from './OwnerDashboard';
import TenantDashboard from './TenantDashboard';
import Footer from '../components/Footer';
import OwnerPaymentHistory from './OwnerPaymentHistory';
import MyBookings from './MyBookings';
import RequestsSection from '../components/RequestsSection';
import Logout from '../components/Logout';

// Role-based sidebar/nav items
const ownerItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'payments', label: 'Payments', icon: <Receipt size={20} /> },
  { id: 'requests', label: 'Requests', icon: <Inbox size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  { id: 'chats', label: 'Chats', icon: <MessageCircle size={20} /> },
];

const tenantItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'bookings', label: 'Bookings', icon: <Inbox size={20} /> },
  { id: 'payments', label: 'Payments', icon: <Receipt size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  { id: 'chats', label: 'Chats', icon: <MessageCircle size={20} /> },
];

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState('profile');
  const navigate = useNavigate();
  // Pick items based on role
  const sidebarItems = user?.role === 'owner' ? ownerItems : tenantItems;

  const renderPage = () => {
    switch (activePage) {
      case 'profile':
        return (
          <div className="px-1">
            <UserProfile />
          </div>
        );

      case 'chats':
        return (
          <div className="px-1 flex flex-col h-full bg-gray-50 ">
            {/* Chat header */}
            {/* <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-900 to-green-900 text-white font-semibold">
              <button
                onClick={() => setActivePage('profile')}
                className="px-1 rounded hover:bg-green-700"
              >
                <ArrowLeft size={20} />
              </button>
              <span>Help & Support</span>
            </div> */}

            {/* Chat body */}
            <div className="flex overflow-scroll  bg-gradient-to-br from-gray-900 to-green-900">
              <HelpSupportChat userId={user._id} />
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="px-1">
            <OwnerPaymentHistory />
          </div>
        );

      case 'requests':
        return (
          <div className="px-1">
            <RequestsSection />
          </div>
        );

      case 'bookings':
        return (
          <div className="px-1">
            <MyBookings />
          </div>
        );

      case 'dashboard':
        return (
          <div className="px-1">
            {user?.role === 'owner' ? <OwnerDashboard /> : <TenantDashboard />}
          </div>
        );

      default:
        return <div className="px-1">Select an option</div>;
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col">
        {/* Shared Header */}
        <div className="flex items-center justify-between p-4 px-6 bg-white shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            {/* <p className="text-gray-500">Manage your account, preferences, and more</p> */}
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Main Section (Sidebar + Content) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className={`flex flex-col fixed inset-y-0 left-0 transform bg-gradient-to-br from-gray-900 to-green-900 text-white w-64 sm:w-56 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-50 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-4 lg:hidden">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="mt-4">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'dashboard') {
                      navigate(user?.role === 'owner' ? '/owner-dashboard' : '/tenant-dashboard');
                      setIsOpen(false);
                      return;
                    }

                    if (item.id === 'logout') {
                      <Logout />;
                      return;
                    }

                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-6 py-3 w-full text-left hover:bg-gray-700 transition ${
                    activePage === item.id ? 'bg-gray-700' : ''
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-700 mt-auto">
              <Logout />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-100 overflow-auto px-1">{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
