import React from 'react';
import AppNavbar from './AppNavbar';
import AIChatBot from '../common/AIChatBot';

const AuthenticatedLayout = ({ children }) => (
  <div className="app-shell">
    <AppNavbar />
    <div className="app-shell-content">{children}</div>
    <AIChatBot />
  </div>
);

export default AuthenticatedLayout;
