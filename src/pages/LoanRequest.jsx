// CustomerDetailsPage.jsx
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { serverTimestamp } from "firebase/firestore";
import {
  saveDataToLocalStorage,
  getDataFromLocalStorage,
  clearLocalStorage,
} from "./localstorage";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";

const firebaseConfig = {
  apiKey: "AIzaSyCRDoHzOTaeVZ_pD28TrabTwGOlPjeJdP0",
  authDomain: "bankdatabase-2791f.firebaseapp.com",
  projectId: "bankdatabase-2791f",
  storageBucket: "bankdatabase-2791f.appspot.com",
  messagingSenderId: "1098875991756",
  appId: "1:1098875991756:web:93d8fcdd6753d695007469",
  measurementId: "G-BFZ2EYKR9R",
};
firebase.initializeApp(firebaseConfig);

function LoanRequest() {
  const [amount, setAmount] = useState("");
  const [receiverno, setReceiverNo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [duration, setDuration] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const OnLoanDetails = async (e) => {
    e.preventDefault();
    if (!amount || duration == "") {
      setErrorMessage("Please fill all the fields");
      return;
    }
    setIsSubmitted(true);
    setErrorMessage("");
    console.log(isSubmitted);
    console.log(duration);
    console.log(amount);

    const docRef = await firebase
      .firestore()
      .collection("LoanDetails")
      .add({
        // accountNumber: localStorage.getItem('accno'),
        accountNumber: parseInt(getDataFromLocalStorage("accountNumber")),
        accountHolderName: getDataFromLocalStorage("name"),
        loanSanctionAccountNo: parseInt(receiverno),
        loanAmount: parseInt(amount),
        repayDue: duration,
        status: "pending",
        loanAppliedOn: serverTimestamp(),
      });
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
      <div className="main-container inside-form">
        <h2>Loan Details</h2>
        <form onSubmit={OnLoanDetails}>
          <label>Loan Amount : </label>
          <input
            type="text"
            placeholder="Enter the Loan Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br></br>
          <label>Repay within : </label>
          <select
            name="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Select</option>
            <option value="30 days">30 days</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
            <option value="2 years">2 years</option>
          </select>
          <br />
          <label>Loan Sanction Account No: </label>
          <input
            type="text"
            value={receiverno}
            placeholder="Enter the Loan's Receiver Account No."
            onChange={(e) => setReceiverNo(e.target.value)}
          />
          <br></br>
          <button className="btn" type="submit">
            Apply for Loan
          </button>
          {isSubmitted && <p>Loan Approval Status Pending!</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </form>
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

export default LoanRequest;
