import React from 'react';
import AppNavbar from './AppNavbar';

const AuthenticatedLayout = ({ children }) => (
  <div className="app-shell">
    <AppNavbar />
    <div className="app-shell-content">{children}</div>
  </div>
);

export default AuthenticatedLayout;
