// CustomerDetailsPage.jsx
import React, { useEffect, useState } from "react";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";
import "../Styles/flexitems.css";
import { getDataFromLocalStorage } from "./localstorage";

function CustomerDetailsPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      fetch(
        "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails"
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Error fetching customer details");
          }
          return response.json();
        })
        .then((data) => {
          if (!data || data.documents.length === 0) {
            console.log("No Data Found");
          }
          const transactionData = data.documents.map((doc) => doc.fields);
          setCustomers(transactionData);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // if (loading) {
  //   return <div>Fetching Customer Details...</div>;
  // }

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
        <h2>Customer Details</h2>
        <div className="item-container">
          {customers.map((customer, index) => (
            <div key={index} className="items">
              <div>
                <strong>Account Status : </strong>
                {customer.status.stringValue}
              </div>
              <div>
                <strong>Account Number : </strong>
                {customer.accountNumber.integerValue}
              </div>
              <div>
                <strong>Account Holder Name : </strong>
                {customer.name.stringValue}
              </div>
              <div>
                <strong>Age : </strong>
                {customer.age.integerValue}
              </div>
              <div>
                <strong>Email : </strong> {customer.email.stringValue}
              </div>
              <div>
                <strong>Balance :</strong> {customer.balance.doubleValue}
              </div>
              <div>
                <strong>Mobile : </strong> {customer.phoneNumber.stringValue}
              </div>
              <div>
                <strong>Occupation : </strong>
                {customer.occupation.stringValue}
              </div>
              <div>
                <strong>Loan:</strong> {customer.Loan.stringValue}
              </div>
              {/* <div>
              <strong>AadharCard : </strong>
              {customer.aadharCardUrl.stringValue}
            </div>
            <div>
              <strong>VoterId : </strong>
              {customer.voterIdUrl.stringValue}
            </div>
            <div>
              <strong>PanCard : </strong>
              {customer.panCardUrl.stringValue}
            </div> */}
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
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

export default CustomerDetailsPage;
