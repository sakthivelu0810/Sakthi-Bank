import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { Link, useNavigate } from 'react-router-dom'; 
import "../Styles/index.css";
import "../Styles/form.css";  

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
      console.error('Error sending password reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container form-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className='btn' type="submit" disabled={loading}>Reset Password</button>
      </form>
      {successMessage && <div className="success">{successMessage}</div>}
      {error && <div className="error">{error}</div>}
      <p>Remember your password? <Link to="/signin">Sign in</Link></p>
    </div>
  );
}

export default ForgotPassword;
