import React, { useState, useEffect } from "react";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";
import "../Styles/flexitems.css";
import { getDataFromLocalStorage } from "./localstorage";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";

function TransactionsDonePage() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Transactions"
      );
      const data = await response.json();
      const transactionData = data.documents.map((doc) => doc.fields); // Assuming transactions are stored in documents as fields
      setTransactions(transactionData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  // Pagination
  const pageNumbers = Math.ceil(transactions.length / transactionsPerPage);
  const renderPageNumbers = Array.from(
    { length: pageNumbers },
    (_, index) => index + 1
  );

  // Change page
  const nextPage = () => {
    if (currentPage < pageNumbers) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

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
        <h2>Transactions Done</h2>
        <div className="item-container">
          {currentTransactions.map((transaction, index) => (
            <div key={index} className="items">
              <div>
                <strong>Type:</strong> {transaction.type.stringValue}
              </div>
              <div>
                <strong>Sender Account Number: </strong>{" "}
                {transaction.senderAccountNumber.integerValue}
              </div>
              {transaction.receiverAccountNumber && (
                <div>
                  <strong>Receiver Account Number: </strong>
                  {transaction.receiverAccountNumber.integerValue}
                </div>
              )}
              <div>
                <strong>Amount:</strong> {transaction.amount.doubleValue}
              </div>
              <div>
                <strong>Timestamp:</strong>{" "}
                {new Date(
                  transaction.timestamp.timestampValue
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="pagination">
          <button
            className="btn"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {renderPageNumbers.map((number) => (
            <button
              key={number}
              className={number === currentPage ? "btn active" : "btn"}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          ))}
          <button
            className="btn"
            onClick={nextPage}
            disabled={currentPage === pageNumbers}
          >
            Next
          </button>
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

export default TransactionsDonePage;

// import React, { useState, useEffect } from "react";
// import Logo from "./logo-no-background.png";
// import "../Styles/navbar.css";
// import "../Styles/index.css";
// import "../Styles/flexitems.css";
// import { getDataFromLocalStorage } from "./localstorage";

// function TransactionsDonePage() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       const response = await fetch(
//         "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Transactions"
//       );
//       const data = await response.json();
//       const transactionData = data.documents.map((doc) => doc.fields); // Assuming transactions are stored in documents as fields
//       setTransactions(transactionData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       setLoading(false);
//     }
//   };

//   // if (loading) {
//   //   return <div>Loading...</div>;
//   // }

//   return (
//     <div className="page-container">
//       <div className="container">
//         <nav className="navbar">
//           <a href="/homepage">Home</a>
//           <a href="/useraccount" id="account">BankAccounts</a>
//           <img src={Logo} alt="logo" />
//           {getDataFromLocalStorage("email") === 'svelu107@gmail.com' && <a href="/admin">Admin</a>}
//           <a href="#contact">About Us</a>
//           <a href="#contact">Contact</a>
//         </nav>
//       </div>
//       <div className="main-container">
//         <h2>Transactions Done</h2>
//         <div className="item-container">
//           {transactions.map((transaction, index) => (
//             <div key={index} className="items">
//               <div>
//                 <strong>Type:</strong> {transaction.type.stringValue}
//               </div>
//               <div>
//                 <strong>Sender Account Number: </strong>{" "}
//                 {transaction.senderAccountNumber.integerValue}
//               </div>
//               <div>
//                 <strong>Receiver Account Number: </strong> {transaction.receiverAccountNumber.integerValue}
//               </div>
//               <div>
//                 <strong>Amount:</strong> {transaction.amount.doubleValue}
//               </div>
//               <div>
//                 <strong>Timestamp:</strong>{" "}
//                 {new Date(
//                   transaction.timestamp.timestampValue
//                 ).toLocaleString()}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="footer" id="contact">
//         <div className="flex-container">
//           <div className="flex-items">
//             <h4>Contact Us</h4>
//             <p>Email : svelu107@gmail.com</p>
//             <p>Mobile : 9361163226</p>
//           </div>
//           <div className="flex-items">
//             <h4>Address</h4>
//             <address>001,
//               XYZ street,
//               Tambaram,
//               Chennai.
//             </address>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TransactionsDonePage;
