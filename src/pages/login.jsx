import React, { useState } from "react";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";
import "../Styles/insideform.css";
import { getDataFromLocalStorage, saveDataToLocalStorage } from "./localstorage";


const LoginPage = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Trim the account number to remove leading/trailing whitespace
      const trimmedAccountNumber = accountNumber.trim();

      // Fetch the customer accounts from Firestore
      const response = await fetch(
        "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customer accounts");
      }
      const data = await response.json();

      console.log("Fetched data:", data);

      // Check if the entered account number exists in any document
      const accountExists = data.documents.some((doc) => {
        const fields = doc.fields;

        // Check if the accountNumber field exists and matches the trimmedAccountNumber
        if (
          fields &&
          fields.accountNumber &&
          parseInt(fields.accountNumber.integerValue) ===
            parseInt(trimmedAccountNumber)
        ) {
          return true;
        }
        return false;
      });

      console.log("Account exists:", accountExists);

      if (accountExists) {
        // Account exists, store account number in local storage
        saveDataToLocalStorage("accountNumber", trimmedAccountNumber);

        // Navigate to the main customer page
        window.location.href = "/customer-page-main";
      } else {
        // Account does not exist
        setError(
          "Invalid account number. Please enter a valid account number."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to login. Please try again later.");
    }
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
      <div className="main-container inside-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <button className="btn" type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
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
};

export default LoginPage;
