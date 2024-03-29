import React, { useState } from "react";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";
import { getDataFromLocalStorage } from "./localstorage";


function Deposit() {  
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = () => {
    // Check if all fields are filled
    if (!amount) {
      setMessage("Please Enter the Amount");
      return;
    }
    setLoading(true);
    const url = `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Account`;
    // Fetch the account details from Firestore API
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Account not found.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.documents.length === 0) {
          throw new Error("Account not found.");
        }

        for (const document of data.documents) {
          const docId = document.name.split("/").pop();
          const accountData = document.fields;

          // Check if provided name matches the name associated with the account number
          if (getDataFromLocalStorage("name") === accountData.name.stringValue) {
            // Calculate new balance
            const currentBalance = parseInt(
              accountData.balance.integerValue ||
                accountData.balance.doubleValue
            );
            const newBalance = currentBalance + parseInt(amount);

            // Update the balance field in the existing account data
            const updatedAccountData = {
              ...accountData,
              balance: { doubleValue: newBalance },
            };

            // Updating in the account Collection

            fetch(
              `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Transactions`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fields: {
                    senderAccountNumber: {
                      integerValue: getDataFromLocalStorage("accountNumber")
                    },
                    type: {
                      stringValue: 'Deposit'
                    },
                    amount: {
                      doubleValue: parseFloat(amount)
                    },
                    timestamp: {
                      timestampValue: new Date().toISOString()
                    }
                  }
                }),
              }
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Deposit unsuccessful. Please try again.");
                }
                setMessage("Deposit successful!");
                setLoading(false); // Enable the button and hide loading indicator
                setAmount("");
              })
              .catch((error) => {
                setMessage(error.message);
                setLoading(false);
              });

            // Updating the balance in the customer collection

            return fetch(
              `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Account/${docId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fields: updatedAccountData,
                }),
              }
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Deposit unsuccessful. Please try again.");
                }
                setMessage("Deposit successful!");
              })
              .catch((error) => {
                setMessage(error.message);
              });
          }
        }

        // If no matching name found
        throw new Error(
          "Provided name does not match the name associated with any account."
        );
      })
      .catch((error) => {
        setMessage(error.message);
      });
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
        <h2>Make a Deposit</h2>
        <div>
          <label>Account Number: {getDataFromLocalStorage("accountNumber")}</label>
          {/* <input
            type="text"
            placeholder="Enter your Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          /> */}
        </div>
        <div>
          <label>Name: {getDataFromLocalStorage("name")}</label>
          {/* <input
            type="text"
            placeholder="Enter Account Holder's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /> */}
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="text"
            placeholder="Enter the Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button className="btn" onClick={handleDeposit} disabled={loading}>Deposit</button>
        {loading && <p>Loading...</p>}
        {message && <p>{message}</p>}
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

export default Deposit;
