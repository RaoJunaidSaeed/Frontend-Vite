import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { Inbox, Receipt, PlusCircle, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/authContext';
import Logout from './Logout';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    let timeout;

    const handleLogoutInternal = () => {
      logout();
      document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      navigate('/login');
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (user) handleLogoutInternal();
      }, 1000 * 60 * 60); // 15 minutes
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    resetTimer(); // Start on load

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeout);
    };
  }, [user, logout, navigate]);

  return (
    <nav className="h-[75px] bg-white/80 backdrop-blur-glass border-b border-white/20 shadow-soft px-4 sm:px-6 md:px-8 lg:px-12 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-heading font-bold text-gradient hover:scale-105 transition-transform duration-200"
        >
          RentoFix
        </Link>

        {/* Hamburger Menu - Visible on sm & md */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-white/20 transition-colors duration-200"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-charcoal" />
            ) : (
              <Menu className="w-6 h-6 text-charcoal" />
            )}
          </button>
        </div>

        {/* Nav Links - Visible only on lg+ */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
          {user?.role === 'owner' && (
            <>
              <Link
                to="/owner-dashboard"
                className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
              >
                <User className="w-4 h-4" />
                Settings
              </Link>
            </>
          )}

          {user?.role === 'tenant' && (
            <>
              <Link
                to="/tenant-dashboard"
                className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
              >
                <User className="w-4 h-4" />
                Settings
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-2xl backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
              <span className="text-charcoal font-medium">
                {' '}
                {user?.firstName + ' ' + user?.lastName || user.email}
              </span>
            </div>
          )}

          {!user && (
            <>
              <Link to="/login" className="nav-link hover-lift px-4 py-2 rounded-xl">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-2xl hover:shadow-hover transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu - Visible on sm & md */}
      {menuOpen && (
        <div className="lg:hidden mt-6 flex flex-col gap-4 text-sm font-medium bg-white/80 backdrop-blur-glass rounded-2xl p-6 border border-white/20 shadow-glass animate-slide-up">
          {user?.role === 'owner' && (
            <>
              <Link
                to="/owner-dashboard"
                onClick={() => setMenuOpen(false)}
                className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
              >
                <User className="w-4 h-4" />
                Settings
              </Link>
            </>
          )}

          {user?.role === 'tenant' && (
            <>
              <Link
                to="/tenant-dashboard"
                onClick={() => setMenuOpen(false)}
                className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
              >
                <User className="w-4 h-4" />
                Settings
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3 px-3 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
              <span className="text-charcoal font-medium">
                {' '}
                {user?.firstName + ' ' + user?.lastName || user.email}
              </span>
            </div>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl hover:shadow-hover transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl hover:shadow-hover transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-center"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-cherry font-semibold hover:bg-cherry/10 px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )} */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// import { Link, useNavigate } from 'react-router-dom';
// import { useContext, useState, useEffect } from 'react';
// import { Inbox, Receipt, PlusCircle, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
// import { AuthContext } from '../context/authContext';
// import Logout from './Logout';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useContext(AuthContext);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//     navigate('/login');
//   };

//   useEffect(() => {
//     let timeout;

//     const handleLogoutInternal = () => {
//       logout();
//       document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//       navigate('/login');
//     };

//     const resetTimer = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         if (user) handleLogoutInternal();
//       }, 1000 * 60 * 60); // 15 minutes
//     };

//     window.addEventListener('mousemove', resetTimer);
//     window.addEventListener('keydown', resetTimer);

//     resetTimer(); // Start on load

//     return () => {
//       window.removeEventListener('mousemove', resetTimer);
//       window.removeEventListener('keydown', resetTimer);
//       clearTimeout(timeout);
//     };
//   }, [user, logout, navigate]);

//   return (
//     <nav className="h-[75px] bg-white/80 backdrop-blur-glass border-b border-white/20 shadow-soft px-4 sm:px-6 md:px-8 lg:px-12 py-4 sticky top-0 z-50">
//       <div className="flex justify-between items-center w-full">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-2xl font-heading font-bold text-gradient hover:scale-105 transition-transform duration-200"
//         >
//           RentoFix
//         </Link>

//         {/* Hamburger Menu - Visible on sm & md */}
//         <div className="lg:hidden">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="p-2 rounded-xl hover:bg-white/20 transition-colors duration-200"
//           >
//             {menuOpen ? (
//               <X className="w-6 h-6 text-charcoal" />
//             ) : (
//               <Menu className="w-6 h-6 text-charcoal" />
//             )}
//           </button>
//         </div>

//         {/* Nav Links - Visible only on lg+ */}
//         <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
//           {user?.role === 'owner' && (
//             <>
//               <Link
//                 to="/owner-dashboard"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 Dashboard
//               </Link>
//               {/* <Link
//                 to="/add-property"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <PlusCircle className="w-4 h-4" />
//                 Add Property
//               </Link> */}
//               <Link
//                 to="/owner-payment-history"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Receipt className="w-4 h-4" />
//                 Payments
//               </Link>
//               <Link
//                 to="/owner-dashboard/requests"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Inbox className="w-4 h-4" />
//                 Requests
//               </Link>
//               <Link
//                 to="/profile"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Profile
//               </Link>
//               <Link
//                 to="/settings"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Settings
//               </Link>
//             </>
//           )}

//           {user?.role === 'tenant' && (
//             <>
//               <Link
//                 to="/tenant-dashboard"
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 Dashboard
//               </Link>
//               <Link
//                 to="/my-bookings"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setMenuOpen(false);
//                   navigate('/my-bookings');
//                 }}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Inbox className="w-4 h-4" />
//                 Bookings
//               </Link>

//               <Link
//                 to="/tenant-payment-history"
//                 onClick={() => navigate('/tenant-payment-history')}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Receipt className="w-4 h-4" />
//                 Payments
//               </Link>
//               <Link
//                 to="/profile"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Profile
//               </Link>
//               <Link
//                 to="/settings"
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Settings
//               </Link>
//             </>
//           )}

//           {user && (
//             <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-2xl backdrop-blur-sm">
//               <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
//                 {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
//               </div>
//               <span className="text-charcoal font-medium">{user.firstName || user.email}</span>
//             </div>
//           )}

//           {!user && (
//             <>
//               <Link to="/login" className="nav-link hover-lift px-4 py-2 rounded-xl">
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-2xl hover:shadow-hover transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}

//           {user && <Logout onClick={handleLogout} />}
//         </div>
//       </div>

//       {/* Mobile Menu - Visible on sm & md */}
//       {menuOpen && (
//         <div className="lg:hidden mt-6 flex flex-col gap-4 text-sm font-medium bg-white/80 backdrop-blur-glass rounded-2xl p-6 border border-white/20 shadow-glass animate-slide-up">
//           {user?.role === 'owner' && (
//             <>
//               <Link
//                 to="/owner-dashboard"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 Dashboard
//               </Link>
//               {/* <Link
//                 to="/add-property"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <PlusCircle className="w-4 h-4" />
//                 Add Property
//                 </Link> */}
//               <Link
//                 to="/owner-payment-history"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Receipt className="w-4 h-4" />
//                 Payments
//               </Link>
//               <Link
//                 to="/owner-dashboard/requests"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Inbox className="w-4 h-4" />
//                 Requests
//               </Link>
//               <Link
//                 to="/profile"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Profile
//               </Link>
//               <Link
//                 to="/settings"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Settings
//               </Link>
//             </>
//           )}

//           {user?.role === 'tenant' && (
//             <>
//               <Link
//                 to="/tenant-dashboard"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 Dashboard
//               </Link>

//               <Link
//                 to="/my-bookings"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setMenuOpen(false);
//                   navigate('/my-bookings');
//                 }}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Inbox className="w-4 h-4" />
//                 Bookings
//               </Link>
//               <Link
//                 to="/tenant-payment-history"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <Receipt className="w-4 h-4" />
//                 Payments
//               </Link>

//               <Link
//                 to="/profile"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-3 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Profile
//               </Link>
//               <Link
//                 to="/settings"
//                 onClick={() => setMenuOpen(false)}
//                 className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
//               >
//                 <User className="w-4 h-4" />
//                 Settings
//               </Link>
//             </>
//           )}

//           {user && (
//             <div className="flex items-center gap-3 px-3 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
//               <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
//                 {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
//               </div>
//               <span className="text-charcoal font-medium">{user.firstName || user.email}</span>
//             </div>
//           )}

//           {!user && (
//             <>
//               <Link
//                 to="/login"
//                 onClick={() => setMenuOpen(false)}
//                 className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl hover:shadow-hover transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-center"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 onClick={() => setMenuOpen(false)}
//                 className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl hover:shadow-hover transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-center"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}

//           {user && (
//             <button
//               onClick={() => {
//                 handleLogout();
//                 setMenuOpen(false);
//               }}
//               className="text-cherry font-semibold hover:bg-cherry/10 px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-3"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
