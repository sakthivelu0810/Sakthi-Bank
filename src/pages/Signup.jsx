import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore, doc, setDoc } from './firebase';
import { serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { saveDataToLocalStorage, getDataFromLocalStorage, clearLocalStorage } from './localstorage';
import "../Styles/index.css";
import "../Styles/form.css";

//import '../Styles/signup.css';

function Signup({ onSignupSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    clearLocalStorage();
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Phone number must be 10 digits long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in either "Admin" or "Users" collection based on the email
      const userDetailsCollection = email === 'svelu107@gmail.com' ? 'Admin' : 'Users';
      await setDoc(doc(firestore, userDetailsCollection, user.uid), {
        email: user.email,
        name: name,
        phoneNumber: phoneNumber,
        TimeCreated: serverTimestamp()
      });

      alert("Signup successful!");
      console.log('Signup successful:', user);

      // Call the onSignupSuccess callback
      onSignupSuccess();
      navigate('/signin'); // Redirect to the Signin page
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <input type="text" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Enter your Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Create New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button className='btn' type="submit" disabled={loading}>Sign Up</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div>
        <p>Already have an account? <Link to="/signin">Sign in</Link></p>
      </div>
    </div>
  );
}

export default Signup;
