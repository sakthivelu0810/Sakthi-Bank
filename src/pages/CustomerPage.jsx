// CustomerPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";  
import "../Styles/index.css";
import { getDataFromLocalStorage } from './localstorage';

function CustomerPage() {
  return (
    <div className='page-container'>
      <div className="container">
        <nav className="navbar">
          <a href="/homepage">Home</a>
          <a href="/useraccount" id="account">BankAccounts</a>
          <img src={Logo} alt="logo" />
          {getDataFromLocalStorage("email") === 'svelu107@gmail.com' && <a href="/admin">Admin</a>}
          <a href="#contact">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="main-container">
        <h2>About Our Bank</h2>
        <p>Offering competitive loans tailored to your needs. Safely store your funds with our secure banking solutions.</p>
      </div>
      <div className="footer" id="contact">
        <div className="flex-container">
          <div className="flex-items">
            <h4>Contact Us</h4>
            <p>Email : svelu107@gmail.com</p>
            <p>Mobile : 9361163226</p>
          </div>
          <div className="flex-items">
            <h4>Address</h4>
            <address>001,
              XYZ street,
              Tambaram,
              Chennai.
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;
