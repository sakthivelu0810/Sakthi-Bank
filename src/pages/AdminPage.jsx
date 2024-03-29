import React from "react";
import { Link } from "react-router-dom";
import { getDataFromLocalStorage } from "./localstorage";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";

function AdminPage() {
  return (
    <div className="page-container">
      <div className="container">
        <nav className="navbar">
          <a href="/homepage">Home</a>
          <a href="/useraccount" id="account">
            BankAccounts
          </a>
          <img src={Logo} alt="logo" />
          {getDataFromLocalStorage("email") === "svelu107@gmail.com" && (
            <a href="/admin">Admin</a>
          )}
          <a href="#contact">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="main-container">
        <h2>Welcome Admin!</h2>
        <div className="button-container">
          <Link to="/Loan-admin">
            <button className="btn">Approval of Loans</button>
          </Link>
          <Link to="/approve-accounts">
            <button className="btn">Approval of Accounts</button>
          </Link>
          <Link to="/transactions">
            <button className="btn">Transactions Done</button>
          </Link>
          <Link to="/customer-details">
            <button className="btn">Customer Details</button>
          </Link>
          <Link to="/loandetails">
            <button className="btn">Loan Details</button>
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

export default AdminPage;
