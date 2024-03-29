import React, { useState } from "react";
import {
  saveDataToLocalStorage,
  getDataFromLocalStorage,
  clearLocalStorage,
} from "./localstorage";
import { Link } from "react-router-dom";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";

function UserAccount() {
  const handleLogout = () => {
    clearLocalStorage();
    console.log("Logging out...");
  };
  return (
    <div className="page-container">
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
        <h2>User Details</h2>
        <p>User Email : {getDataFromLocalStorage("email")}</p>
        <Link to="/signin">
          <button className="btn" onClick={handleLogout}>Logout</button>
        </Link>

        <div className="button-container">
          <Link to="/myaccounts">
            <button className="btn">My Accounts</button>
          </Link>
          <Link to="/create-account">
            <button className="btn">Create an Account</button>
          </Link>
          <Link to="/login">
            <button className="btn">Already Have an Account</button>
          </Link>
        </div>
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
            <address>001, XYZ street, Tambaram, Chennai.</address>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccount;
