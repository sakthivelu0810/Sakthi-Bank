import React, { useEffect, useState } from "react";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";
import "../Styles/flexitems.css";
import { getDataFromLocalStorage } from "./localstorage";

function LoanDetailsPage() {
  const ITEMS_PER_PAGE = 1;
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLoanDetails();
  }, []);

  const fetchLoanDetails = async () => {
    try {
      const response = await fetch(
        "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/LoanDetails"
      );
      const data = await response.json();
      const loanData = data.documents.map((doc) => doc.fields);
      setLoans(loanData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching loan details:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(loans.length / ITEMS_PER_PAGE);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const currentLoans = loans.slice(firstIndex, lastIndex);

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
        <h2>Loan Details</h2>
        <div className="item-container">
          {currentLoans.map((loan, index) => (
            <div key={index} className="items">
              <div>
                <strong>Account Number : </strong>
                {loan.accountNumber.integerValue}
              </div>
              <div>
                <strong>Account Holder Name : </strong>
                {loan.accountHolderName.stringValue}
              </div>
              <div>
                <strong>Loan Applied On : </strong>
                {loan.loanAppliedOn.timestampValue}
              </div>
              <div>
                <strong>Loan Sanctioned Account Number : </strong>
                {loan.loanSanctionAccountNo.integerValue}
              </div>
              <div>
                <strong>Loan Amount : </strong> {loan.loanAmount.integerValue}
              </div>
              <div>
                <strong>Loan Status :</strong> {loan.status.stringValue}
              </div>
              <div>
                <strong>Repay Due : </strong> {loan.repayDue.stringValue}
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={() =>
              handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
            }
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={pageNumber === currentPage ? "active" : ""}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() =>
              handlePageChange(
                currentPage < totalPages ? currentPage + 1 : totalPages
              )
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
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

export default LoanDetailsPage;



// import React, { useEffect, useState } from "react";
// import Logo from "./logo-no-background.png";
// import "../Styles/navbar.css";
// import "../Styles/index.css";
// import "../Styles/flexitems.css";
// import { getDataFromLocalStorage } from "./localstorage";

// function LoanDetailsPage() {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchLoanDetais();
//   }, []);

//   const fetchLoanDetais = async () => {
//     try {
//       fetch(
//         "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/LoanDetails"
//       )
//         .then((response) => {
//           if (!response.ok) {
//             console.log("Error fetching customer details");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           if (!data || data.documents.length === 0) {
//             console.log("No Data Found");
//           }
//           const loanData = data.documents.map((doc) => doc.fields);
//           setLoans(loanData);
//           setLoading(false);
//         });
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-container">
//       <div className="container">
//         <nav className="navbar">
//           <a href="/homepage">Home</a>
//           <a href="/useraccount" id="account">
//             BankAccounts
//           </a>
//           <img src={Logo} alt="logo" />
//           {getDataFromLocalStorage("email") === "svelu107@gmail.com" && (
//             <a href="/admin">Admin</a>
//           )}
//           <a href="#contact">About Us</a>
//           <a href="#contact">Contact</a>
//         </nav>
//       </div>
//       <div className="main-container">
//       <h2>Loan Details</h2>
//       <div className="item-container">
//         {loans.map((loan, index) => (
//           <div key={index} className="items">
//             <div>
//               <strong>Account Number : </strong>
//               {loan.accountNumber.integerValue}
//             </div>
//             <div>
//               <strong>Account Holder Name : </strong>
//               {loan.accountHolderName.stringValue}
//             </div>
//             <div>
//               <strong>Loan Applied On : </strong>
//               {loan.loanAppliedOn.timestampValue}
//             </div>
//             <div>
//               <strong>Loan Sanctioned Account Number : </strong>
//               {loan.loanSanctionAccountNo.integerValue}
//             </div>
//             <div>
//               <strong>Loan Amount : </strong> {loan.loanAmount.integerValue}
//             </div>
//             <div>
//               <strong>Loan Status :</strong> {loan.status.stringValue}
//             </div>
//             <div>
//               <strong>Repay Due : </strong> {loan.repayDue.stringValue}
//             </div>
//           </div>
//         ))}
//       </div>
//       </div>
//       <div className="footer">
//         <div className="flex-container">
//           <div className="flex-items">
//             <h4>Contact Us</h4>
//             <p>Email : svelu107@gmail.com</p>
//             <p>Mobile : 9361163226</p>
//           </div>
//           <div className="flex-items">
//             <h4>Address</h4>
//             <address>001, XYZ street, Tambaram, Chennai.</address>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoanDetailsPage;
