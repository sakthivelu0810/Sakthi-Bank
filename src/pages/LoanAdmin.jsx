import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";  
import "../Styles/index.css";
import { getDataFromLocalStorage } from "./localstorage";

function ApproveLoanPage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(
        "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/LoanDetails"
      );
      console.log("Response:", response);

      if (response.data && response.data.documents) {
        const pending = response.data.documents
          .filter(
            (doc) => doc.fields && doc.fields.status.stringValue === "pending"
          )
          .map((doc) => ({
            id: doc.name.split("/").pop(), // Extract document ID from the name
            fields: doc.fields || {}, // Store all fields
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

  const fetchDocumentId = async (accountNumber) => {
    try {
      // Fetch all documents from customerDetails collection
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails`
      );

      // Check if any documents match the accountNumber
      if (response.data.documents && response.data.documents.length > 0) {
        for (const document of response.data.documents) {
          const fields = document.fields;
          if (
            fields &&
            fields.accountNumber &&
            fields.accountNumber.integerValue === accountNumber
          ) {
            // Found matching document, return its ID
            //alert("account no found");
            return document.name.split("/").pop();
          }
        }
      }
      // No matching document found
      return null;
    } catch (error) {
      console.error("Error fetching document ID:", error);
      throw error; // Propagate the error for handling elsewhere
    }
  };

  const fetchAndUpdateDocument = async (accountNumber, newBalance) => {
    try {
      // Fetch documents corresponding to the accountNumber
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails`
      );

      if (response.data.documents && response.data.documents.length > 0) {
        //alert("first if");
        // Iterate over the documents to find the one with the matching account number
        response.data.documents.forEach(async (document) => {
          if (document.fields.accountNumber.integerValue === accountNumber) {
            const documentId = document.name.split("/").pop();
            const currentBalance = parseInt(
              document.fields.balance.doubleValue
            );

            // Calculate updated balance by adding the new balance to the current balance
            const updatedBalance = currentBalance + parseInt(newBalance);

            // Update the balance field in the document

            const updatedFields = {
              ...document.fields,
              Loan: { stringValue: "Yes" },
              balance: { doubleValue: updatedBalance },
            };

            await axios.patch(
              `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails/${documentId}`,
              {
                fields: updatedFields,
              }
            );

            console.log("Balance updated successfully");
          }
        });
      } else {
        console.log(`No documents found`);
      }
    } catch (error) {
      console.error("Error fetching and updating document:", error);
      throw error; // Propagate the error for handling elsewhere
    }
  };

  const updateRequestStatus = async (requestId, newStatus, loanAmount) => {
    try {
      // Fetch existing fields of the request
      const existingRequest = pendingRequests.find(
        (request) => request.id === requestId
      );
      const updatedFields = {
        ...existingRequest.fields,
        status: { stringValue: newStatus },
      };

      // Patch the request with updated fields
      await axios.patch(
        `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/LoanDetails/${requestId}`,
        {
          fields: updatedFields,
        }
      );

      // If request is approved, generate account number and set balance to 0
      if (newStatus === "approved") {
        // Update Firestore with new fields
        // await axios.patch(`https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/LoanDetails/${requestId}`, {
        //   fields: {
        //     ...updatedFields,
        //     LoanAmount: {integerValue : parseInt(LoanAmount)}
        //   }
        // });
        const accountNumber =
          existingRequest.fields.loanSanctionAccountNo.integerValue;
        //alert(accountNumber);
        if (!accountNumber) {
          setError(
            "Failed to update request status. Account number is not defined."
          );
          return;
        }

        fetchDocumentId(accountNumber)
          .then((documentId) => {
            if (documentId) {
              console.log(
                `Document ID for account number ${accountNumber} is ${documentId}`
              );

              // Proceed with any further processing using the documentId
            } else {
              console.log(
                `No document found for account number ${accountNumber}`
              );
            }
          })
          .catch((error) => {
            console.error("Error fetching document ID:", error);
            // Handle the error appropriately
          });

        fetchAndUpdateDocument(accountNumber, loanAmount)
          .then(() => {
            console.log("Document fetched and balance updated successfully");
            // Proceed with any further processing
          })
          .catch((error) => {
            console.error("Error fetching and updating document:", error);
            // Handle the error appropriately
          });
      }

      setPendingRequests(
        pendingRequests.filter((request) => request.id !== requestId)
      );

      // Show toast notification
      toast.success(
        `Request ${
          newStatus === "approved" ? "Approved" : "Rejected"
        } successfully`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      console.error(`Error updating request ${requestId} status:`, error);
      // Show error toast notification
      toast.error(
        `Failed to ${
          newStatus === "approved" ? "approve" : "reject"
        } request. Please try again later`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
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
      <div className="main-container">
      <h2>Approve Loans</h2>
      {error && <p>{error}</p>}
      {pendingRequests.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
        No pending account requests
      </p>
      ) : (
        <div className="flex-container">
          {pendingRequests.map((request) => (
            <div className="flex-items" key={request.id}>
              <p>Account Holder Name : </p>
              {request.fields.accountHolderName.stringValue}
              <p>Account Number : </p>
              {request.fields.accountNumber.integerValue}
              <p>Loan Amount : </p> {request.fields.loanAmount.integerValue}
              <p>Loan Applied On : </p>
              {request.fields.loanAppliedOn.timestampValue}
              <p>Loan Sanction Account No : </p>
              {request.fields.loanSanctionAccountNo.integerValue}
              <p>Repay Due : </p> {request.fields.repayDue.stringValue}
              <br />
              <br />
              <button
                className="btn"
                onClick={() =>
                  updateRequestStatus(
                    request.id,
                    "approved",
                    request.fields.loanAmount.integerValue
                  )
                }
              >
                Approve Loan
              </button>
              <button
                className="btn redbtn"
                onClick={() =>
                  updateRequestStatus(
                    request.id,
                    "rejected",
                    request.fields.loanAmount.integerValue
                  )
                }
              >
                Reject Loan
              </button>
            </div>
          ))}
        </div>
      )}
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

export default ApproveLoanPage;
