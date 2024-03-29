import React, { useState, useEffect } from "react";
import axios from "axios";
// import sendApprovalEmail from './emailService';
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";
import { getDataFromLocalStorage } from "./localstorage";

function ApproveAccountsPage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(
        "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails"
      );
      console.log("Response:", response);

      if (response.data && response.data.documents) {
        const pending = response.data.documents
          .filter(
            (doc) => doc.fields && doc.fields.status.stringValue === "pending"
          )
          .map((doc) => ({
            id: doc.name.split("/").pop(), // Extract document ID from the name
            fields: doc.fields, // Store all fields
          }));
        setPendingRequests(pending);
      } else {
        console.error("Error fetching pending requests:", response);
        setError("No pending account requests found");
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setError("Failed to fetch pending requests. Please try again later.");
    }
  };

  const updateRequestStatus = async (
    requestId,
    newStatus,
    email,
    phoneNumber
  ) => {
    try {
      // Fetch existing fields of the request
      const existingRequest = pendingRequests.find(
        (request) => request.id === requestId
      );
      const updatedFields = {
        ...existingRequest.fields,
        status: { stringValue: newStatus },
        email: { stringValue: email },
        phoneNumber: { stringValue: phoneNumber },
      };

      // Patch the request with updated fields
      await axios.patch(
        `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails/${requestId}`,
        {
          fields: updatedFields,
        }
      );

      // If request is approved, generate account number and set balance to 0
      if (newStatus === "approved") {
        // await sendApprovalEmail(getDataFromLocalStorage("email"),'Account Approved','Your account has been approved. You can now access your account.');  
        const accountNumber = generateAccountNumber();
        const balance =  1000;
        const Loan = "No";

        // Update Firestore with new fields
        await axios.patch(
          `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails/${requestId}`,
          {
            fields: {
              ...updatedFields,
              accountNumber: { integerValue: accountNumber },
              balance: { doubleValue: balance },
              Loan: { stringValue: Loan },
            },
          }
        );
        await axios.post(
          "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Account",
          {
            fields: {
              accountNumber: { integerValue: accountNumber },
              balance: { doubleValue: balance },
              name: { stringValue: existingRequest.fields.name.stringValue }, // Add account holder's name
              customerId: { stringValue: requestId }, // Add customer's account ID
              Loan: {stringValue: Loan},
              email: {stringValue: email}
            },
          }
        );
      }

      // Update the status in the local state
      setPendingRequests(
        pendingRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error(`Error updating request ${requestId} status:`, error);
    }
  };

  // Function to generate a 6-digit random account number
  const generateAccountNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
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
        <h2>Approve Accounts</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {pendingRequests.length === 0 ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            No pending account requests
          </p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                style={{
                  border: "1px solid #ccc",
                  marginBottom: "20px",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <strong>Name:</strong> {request.fields.name.stringValue}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Age:</strong> {request.fields.age.integerValue}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Occupation:</strong>{" "}
                  {request.fields.occupation.stringValue}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Status:</strong> {request.fields.status.stringValue}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Email:</strong> {request.fields.email.stringValue}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Phone Number:</strong>{" "}
                  {request.fields.phoneNumber.stringValue}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  {/* Display images if available */}
                  {request.fields.aadharCardUrl.stringValue && (
                    <img
                      src={request.fields.aadharCardUrl.stringValue}
                      alt="Aadhar Card"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginTop: "10px",
                      }}
                    />
                  )}
                  {request.fields.panCardUrl.stringValue && (
                    <img
                      src={request.fields.panCardUrl.stringValue}
                      alt="PAN Card"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginTop: "10px",
                      }}
                    />
                  )}
                  {request.fields.voterIdUrl.stringValue && (
                    <img
                      src={request.fields.voterIdUrl.stringValue}
                      alt="Voter ID"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
                <div>
                  <button className="btn"
                    onClick={() =>
                      updateRequestStatus(
                        request.id,
                        "approved",
                        request.fields.email.stringValue,
                        request.fields.phoneNumber.stringValue
                      )
                    }
                  >
                    Approve
                  </button>
                  <button className="btn"
                    onClick={() =>
                      updateRequestStatus(
                        request.id,
                        "rejected",
                        request.fields.email.stringValue,
                        request.fields.phoneNumber.stringValue
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
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

export default ApproveAccountsPage;
