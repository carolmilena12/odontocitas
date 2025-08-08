// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div       style={{ backgroundImage: "url('/login-bg.jpeg')" }}
      className="flex items-center justify-center">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
