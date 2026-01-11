import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import {
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    role: 'tenant', // Default role
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Single Step Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST directly to signup
      const res = await API.post('/v1/auth/signup', form);

      if (res.data.status === 'success') {
        toast.success('Account created successfully!');
        // Redirect to login or dashboard
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT SECTION (Branding) */}
          <div className="flex flex-col justify-center text-white px-10 space-y-8 lg:pr-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-400" />
                <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                  Welcome to Rentofix
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Simplify Your{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Rental Journey
                </span>
              </h1>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed">
              Join thousands of users who have transformed their rental experience.
            </p>

            {/* Feature List */}
            <div className="space-y-4 pt-4">
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6 text-white" />,
                  title: 'Fast & Secure',
                  desc: 'Industry-leading security.',
                },
                {
                  icon: <BadgeCheck className="w-6 h-6 text-white" />,
                  title: 'Verified Listings',
                  desc: 'Trustworthy community.',
                },
                {
                  icon: <Headphones className="w-6 h-6 text-white" />,
                  title: '24/7 Support',
                  desc: 'Always here to help.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-green-400 hover:text-green-300 font-semibold transition"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* RIGHT SECTION – FORM */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl blur-2xl" />

            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 lg:p-10 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400 mb-8">Join Rentofix and start your journey today</p>

              <form onSubmit={handleSignup} className="space-y-5">
                {/* First + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  {['firstName', 'lastName'].map((field, i) => (
                    <div key={i}>
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                        {field === 'firstName' ? 'First Name' : 'Last Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                          type="text"
                          name={field}
                          placeholder={field === 'firstName' ? 'John' : 'Doe'}
                          value={form[field]}
                          onChange={handleChange}
                          required
                          className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-green-500 transition"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="example@mail.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+92 ... ......."
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      name="passwordConfirm"
                      placeholder="••••••••"
                      value={form.passwordConfirm}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                    I am a
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 cursor-pointer focus:ring-2 focus:ring-green-500 transition appearance-none"
                  >
                    <option value="tenant" className="bg-slate-800">
                      Tenant
                    </option>
                    <option value="owner" className="bg-slate-800">
                      Owner
                    </option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api/axios';
// import { toast } from 'react-toastify';

// // Icons from lucide-react
// import {
//   ShieldCheck,
//   BadgeCheck,
//   Headphones,
//   Sparkles,
//   Check,
//   User,
//   Mail,
//   Phone,
//   Lock,
//   ArrowRight,
// } from 'lucide-react';

// const Signup = () => {
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     passwordConfirm: '',
//     phoneNumber: '',
//     role: 'tenant',
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   // Step 1 – Request OTP
//   const handleRequestOTP = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/v1/auth/sendOTP', { email: form.email });
//       if (res.data.status === 'success') {
//         setOtpSent(true);
//         toast.success('OTP sent to your email.');
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to send OTP');
//     }
//   };

//   // Step 2 – Verify OTP then create user
//   const handleVerifyAndSignup = async () => {
//     try {
//       const res = await API.post('/v1/auth/verifyOTP', {
//         email: form.email,
//         otp,
//       });

//       if (res.data.status === 'success') {
//         const signupRes = await API.post('/v1/auth/signup', form);
//         if (signupRes.data.status === 'success') {
//           toast.success('Signup complete!');
//           navigate('/login');
//         }
//       } else {
//         toast.error('Invalid OTP');
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Verification failed');
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       const res = await API.post('/v1/auth/resendOTP', { email: form.email });
//       toast.success(res.data.message || 'OTP resent');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to resend OTP');
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
//       {/* Background Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

//       {/* Full page blur effect */}
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl" />

//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
//       </div>

//       {/* Main container */}
//       <div className="relative z-10 w-full max-w-6xl">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//           {/* LEFT SECTION */}
//           <div className="flex flex-col justify-center text-white  px-10 space-y-8 lg:pr-8">
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <Sparkles className="w-6 h-6 text-green-400" />
//                 <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
//                   Welcome to Rentofix
//                 </span>
//               </div>

//               <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
//                 Simplify Your{' '}
//                 <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
//                   Rental Journey
//                 </span>
//               </h1>
//             </div>

//             <p className="text-lg text-slate-300 leading-relaxed">
//               Join thousands of users who have transformed their rental experience. Whether you're a
//               tenant or an owner, Rentofix makes everything simple, secure, and seamless.
//             </p>
//             <div className="space-y-4 pt-4">
//               {[
//                 {
//                   icon: <ShieldCheck className="w-6 h-6 text-white" />,
//                   title: 'Fast & Secure',
//                   desc: 'Your data is protected with industry-leading security.',
//                 },
//                 {
//                   icon: <BadgeCheck className="w-6 h-6 text-white" />,
//                   title: 'Easy Verification',
//                   desc: 'Quick OTP verification ensures safety.',
//                 },
//                 {
//                   icon: <Headphones className="w-6 h-6 text-white" />,
//                   title: '24/7 Support',
//                   desc: 'We’re always here to help.',
//                 },
//               ].map((item, i) => (
//                 <div key={i} className="flex gap-4 items-start">
//                   <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
//                     {item.icon}
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-white mb-1">{item.title}</h3>
//                     <p className="text-slate-400 text-sm">{item.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="pt-4">
//               <p className="text-sm text-slate-500">
//                 Already have an account?{' '}
//                 <a
//                   href="/login"
//                   className="text-green-400 hover:text-green-300 font-semibold transition"
//                 >
//                   Sign in here
//                 </a>
//               </p>
//             </div>
//           </div>

//           {/* RIGHT SECTION – FORM */}
//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl blur-2xl" />

//             <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 lg:p-10 shadow-2xl">
//               <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
//               <p className="text-slate-400 mb-8">Join Rentofix and start your journey today</p>

//               {!otpSent ? (
//                 <form onSubmit={handleRequestOTP} className="space-y-5">
//                   {/* First + Last Name */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {['firstName', 'lastName'].map((field, i) => (
//                       <div key={i}>
//                         <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
//                           {field === 'firstName' ? 'First Name' : 'Last Name'}
//                         </label>
//                         <div className="relative">
//                           <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
//                           <input
//                             type="text"
//                             name={field}
//                             placeholder={field === 'firstName' ? 'firstName' : 'lastName'}
//                             value={form[field]}
//                             onChange={handleChange}
//                             required
//                             className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-green-500 transition"
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="example@mail.com"
//                         value={form.email}
//                         onChange={handleChange}
//                         required
//                         className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
//                       />
//                     </div>
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         placeholder="+92 ... ......."
//                         value={form.phoneNumber}
//                         onChange={handleChange}
//                         required
//                         className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
//                       />
//                     </div>
//                   </div>

//                   {/* Password */}
//                   <div>
//                     <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
//                       <input
//                         type="password"
//                         name="password"
//                         placeholder="••••••••"
//                         value={form.password}
//                         onChange={handleChange}
//                         required
//                         className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
//                       />
//                     </div>
//                   </div>

//                   {/* Confirm Password */}
//                   <div>
//                     <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
//                       <input
//                         type="password"
//                         name="passwordConfirm"
//                         placeholder="••••••••"
//                         value={form.passwordConfirm}
//                         onChange={handleChange}
//                         required
//                         className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-green-500 transition"
//                       />
//                     </div>
//                   </div>

//                   {/* Role */}
//                   <div>
//                     <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
//                       I am a
//                     </label>
//                     <select
//                       name="role"
//                       value={form.role}
//                       onChange={handleChange}
//                       required
//                       className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 cursor-pointer focus:ring-2 focus:ring-green-500 transition"
//                     >
//                       <option value="tenant">Tenant</option>
//                       <option value="owner">Owner</option>
//                     </select>
//                   </div>

//                   {/* Send OTP */}
//                   <button
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg mt-6"
//                   >
//                     Send OTP
//                     <ArrowRight className="w-5 h-5" />
//                   </button>
//                 </form>
//               ) : (
//                 <div className="space-y-5">
//                   <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
//                     <p className="text-sm text-green-300">OTP sent to your email</p>
//                   </div>

//                   <div>
//                     <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
//                       Enter OTP
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="000000"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-500 transition"
//                     />
//                   </div>

//                   <button
//                     onClick={handleVerifyAndSignup}
//                     className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
//                   >
//                     Verify & Sign Up
//                     <ArrowRight className="w-5 h-5" />
//                   </button>

//                   <button
//                     onClick={handleResendOTP}
//                     className="w-full border border-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500 font-semibold py-3 rounded-lg transition"
//                   >
//                     Resend OTP
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;
