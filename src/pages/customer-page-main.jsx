import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
  clearLocalStorage,
} from "./localstorage";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";

const CustomerPageMain = () => {
  // State to hold customer details
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch customer details
  const fetchCustomerDetails = async (accountNumber) => {
    try {
      // Make a fetch request to retrieve customer details from Firestore
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Account`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customer details");
      }
      const data = await response.json();

      // Iterate over each document to find the matching account number
      let matchedDocument = null;
      for (const doc of data.documents) {
        const fields = doc.fields;
        if (
          fields &&
          fields.accountNumber &&
          parseInt(fields.accountNumber.integerValue) ===
            parseInt(accountNumber)
        ) {
          matchedDocument = doc;
          break; // Exit loop if a match is found
        }
      }

      if (matchedDocument) {
        // Extract necessary details from the matched document
        const accountNumber = matchedDocument.fields.accountNumber.integerValue;
        saveDataToLocalStorage("accountNumber", accountNumber);
        const customerName = matchedDocument.fields.name
          ? matchedDocument.fields.name.stringValue
          : "N/A";
        saveDataToLocalStorage("name", customerName);
        const customerId = matchedDocument.fields.customerId
          ? matchedDocument.fields.customerId.stringValue
          : "N/A";
        const balance = matchedDocument.fields.balance
          ? matchedDocument.fields.balance.doubleValue
          : 0;  
        saveDataToLocalStorage("balance", balance);
        const email = matchedDocument.fields.email
          ? matchedDocument.fields.email.stringValue
          : "N/A";
        const Loan = matchedDocument.fields.Loan
          ? matchedDocument.fields.Loan.stringValue
          : "N/A";

        // Update the state with the details of the matched document
        setCustomerDetails({
          accountNumber,
          customerName,
          customerId,
          balance,
          email,
          Loan, // Include loan field in the state
          // Add more fields as needed
        });
      } else {
        setError("Customer details not found");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    // Retrieve account number from local storage
    const loggedInAccountNumber = getDataFromLocalStorage("accountNumber");

    if (loggedInAccountNumber) {
      // Fetch customer details using the account number
      fetchCustomerDetails(loggedInAccountNumber);
    } else {
      setError("Account number not found in local storage");
    }
  }, []);

  const handleLogOut = () => {
    console.log("Logging out...");
    clearLocalStorage();
  };

  // Function to handle loan button click
  const handleLoanClick = () => {
    // Implement loan functionality here
    console.log("Requesting loan...");
  };

  // Function to handle transaction history button click
  const handleTransactionHistoryClick = () => {
    // Implement transaction history functionality here
    console.log("Fetching transaction history...");
  };

  // Function to handle bank transfer button click
  const handleBankTransferClick = () => {
    // Implement bank transfer functionality here
    console.log("Initiating bank transfer...");
  };

  // Function to handle deposit button click
  const handleDepositClick = () => {
    // Implement deposit functionality here
    console.log("Initiating deposit...");
  };

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
        <div className="customer-details">
          <h1>Welcome {customerDetails && customerDetails.customerName}</h1>
          {error && <p>{error}</p>}
          {customerDetails && (
            <div>
              <h2>Customer Details</h2>
              <p className="account-number">
                Account Number: {customerDetails.accountNumber}
              </p>
              <p className="customer-name">
                Customer Name: {customerDetails.customerName}
              </p>
              <p className="customerId">CustomerId: {customerDetails.customerId}</p>
              <p className="balance">Balance: {customerDetails.balance}</p>
              <p className="email">
                Email: {customerDetails.email}
              </p>
              <p className="loan-status">Loan: {customerDetails.Loan}</p>
              <div className="buttons">
                <Link to="/Loan-request">
                  <button className="btn" onClick={handleLoanClick}>
                    Apply for Loan
                  </button>
                </Link>
                <Link to="/customer-transactions">
                  <button
                    className="btn"
                    onClick={handleTransactionHistoryClick}
                  >
                    Transaction History
                  </button>
                </Link>
                <Link to="/banktransfer">
                  <button className="btn" onClick={handleBankTransferClick}>
                    Money Transfer
                  </button>
                </Link>
                <Link to="/deposit">
                  <button className="btn" onClick={handleDepositClick}>
                    Deposit
                  </button>
                </Link>
                <Link to="/signin">
                  <button className="btn" onClick={handleLogOut}>
                    Logout
                  </button>
                </Link>
              </div>
            </div>
          )}
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
};

export default CustomerPageMain;
