import React, { useState, useEffect } from "react";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";  
import "../Styles/index.css";
import "../Styles/flexitems.css";
import { getDataFromLocalStorage } from "./localstorage";

function CustomersTransactionsPage() {
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
      const accountNumber = getDataFromLocalStorage("accountNumber");

      const filteredTransactions = data.documents.filter((doc) => {
        const fields = doc.fields;
        return fields.senderAccountNumber.integerValue === accountNumber ||
               fields.receiverAccountNumber.integerValue === accountNumber;
      });

      const transactionData = filteredTransactions.map((doc) => doc.fields); // Assuming transactions are stored in documents as fields
      setTransactions(transactionData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          {/* <button
            className="btn"
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
          >
            First
          </button> */}
          <button
            className="btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: Math.ceil(transactions.length / transactionsPerPage) }).map((_, index) => (
            <button
              key={index}
              className={`btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(transactions.length / transactionsPerPage)}
          >
            Next
          </button>
          {/* <button
            className="btn"
            onClick={() => paginate(Math.ceil(transactions.length / transactionsPerPage))}
            disabled={currentPage === Math.ceil(transactions.length / transactionsPerPage)}
          >
            Last
          </button> */}
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

export default CustomersTransactionsPage;





// import React, { useState, useEffect } from "react";
// import Logo from "./logo-no-background.png";
// import "../Styles/navbar.css";  
// import "../Styles/index.css";
// import "../Styles/flexitems.css";
// import { getDataFromLocalStorage } from "./localstorage";


// function CustomersTransactionsPage() {
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
//       const accountNumber = getDataFromLocalStorage("accountNumber");

//       const filteredTransactions = data.documents.filter((doc) => {
//         const fields = doc.fields;
//         return fields.senderAccountNumber.integerValue === accountNumber ||
//                fields.receiverAccountNumber.integerValue === accountNumber;
//       });

//       const transactionData = filteredTransactions.map((doc) => doc.fields); // Assuming transactions are stored in documents as fields
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
//               {transaction.receiverAccountNumber && (
//                 <div>
//                   <strong>Receiver Account Number: </strong>
//                   {transaction.receiverAccountNumber.integerValue}
//                 </div>
//               )}
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

// export default CustomersTransactionsPage;
