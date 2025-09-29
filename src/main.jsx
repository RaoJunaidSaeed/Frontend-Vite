import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/authContext';
import { LoadingProvider } from './context/LoadingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </AuthProvider>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { AuthProvider } from './context/authContext';

// import { Provider } from 'react-redux';
// import store from './redux/store'; // ✅ make sure this path is correct
// import { LoadingProvider } from './context/LoadingContext';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//     <AuthProvider>
//       <LoadingProvider>
//         <App />
//       </LoadingProvider>
//     </AuthProvider>
//   </Provider>
// );
