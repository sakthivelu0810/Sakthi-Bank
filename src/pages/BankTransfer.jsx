import React, { useState } from "react";
import { getDataFromLocalStorage } from "./localstorage";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";

function BankTransfer() {
  const loggedInAccountNumber = getDataFromLocalStorage('accountNumber');
  const [confirmedAccountNumber, setConfirmedAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false); // State to track transaction progress
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setConfirmationDialogOpen(false); // Close confirmation dialog
    setTransactionInProgress(true); // Set transaction in progress
    try {
      if (parseFloat(amount) > 0) {
        // Fetch data from Firestore using the provided IFSC code as document ID
        const response = await fetch(`https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${ifscCode}`);
        const data = await response.json();
 
        if (!data.fields) {
          setError('No bank is available for the provided IFSC code.');
          setTimeout(() => setError(''), 4000);
          return;
        }
 
        const domain = data.fields.domain_name.stringValue;
 
        // Fetch sender's account data using the retrieved domain
        const senderAccountResponse = await fetch(`https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Account`);
        const senderAccountData = await senderAccountResponse.json();
 
        // Search for the sender's account number within the documents
        const senderDoc = senderAccountData.documents.find(doc => {
          const accountNumberField = doc.fields.accountNumber;
          return accountNumberField && (parseInt(accountNumberField.integerValue || accountNumberField.stringValue) === parseInt(loggedInAccountNumber));
        });

        console.log(senderDoc);
 
        if (!senderDoc) {
          setError('Sender account not found.');
          setTimeout(() => setError(''), 4000);
          return;
        }
 
        // Check if the receiver account exists within the specified IFSC
        const receiverAccountResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${domain}/databases/(default)/documents/Account`);
        const receiverAccountData = await receiverAccountResponse.json();
        const receiverDoc = receiverAccountData.documents.find(doc => {
          const accountNumberField = doc.fields.accountNumber;
          return accountNumberField && (parseInt(accountNumberField.integerValue || accountNumberField.stringValue) === parseInt(confirmedAccountNumber));
        });
 
        if (!receiverDoc) {
          setError('This bank account is not available in the receiver bank.');
          setTimeout(() => setError(''), 4000);
          return;
        }
 
        // Proceed with the transaction
        const senderNewBalance = parseFloat(senderDoc.fields.balance.doubleValue) - parseFloat(amount);
        if (senderNewBalance >= 0) {
          // Update sender's balance
          await fetch(`https://firestore.googleapis.com/v1/${senderDoc.name}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                ...senderDoc.fields,
                balance: {
                  doubleValue: senderNewBalance
                }
              }
            })
          });
 
          // Add transaction to sender's transaction history
          await fetch(`https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Transactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                senderAccountNumber: {
                  integerValue: parseInt(loggedInAccountNumber)
                },
                receiverAccountNumber: {
                  integerValue: parseInt(confirmedAccountNumber)
                },
                type: {
                  stringValue: 'Debit'
                },
                amount: {
                  doubleValue: parseFloat(amount)
                },
                timestamp: {
                  timestampValue: new Date().toISOString()
                }
              }
            })
          });
          // Update receiver's balance
          const receiverNewBalance = parseFloat(receiverDoc.fields.balance.doubleValue) + parseFloat(amount);
          await fetch(`https://firestore.googleapis.com/v1/${receiverDoc.name}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                ...receiverDoc.fields,
                balance: {
                  doubleValue: receiverNewBalance
                }
              }
            })
          });
 
          // Add transaction to receiver's transaction history
          await fetch(`https://firestore.googleapis.com/v1/projects/${domain}/databases/(default)/documents/Transactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                senderAccountNumber: {
                  integerValue: parseInt(loggedInAccountNumber)
                },
                receiverAccountNumber: {
                  integerValue: parseInt(confirmedAccountNumber)
                },
                type: {
                  stringValue: 'Credit'
                },
                amount: {
                  doubleValue: parseFloat(amount)
                },
                timestamp: {
                  timestampValue: new Date().toISOString()
                }
              }
            })
          });
 
          // Show success message if the transaction succeeds
          setSuccessMessage('Transaction successful!');
          setTimeout(() => setSuccessMessage(''), 4000);
        } else {
          setError('Insufficient balance.');
          setTimeout(() => setError(''), 4000);
        }
      } else {
        setError('Invalid amount.');
        setTimeout(() => setError(''), 4000);
      }
    } catch (error) {
      // Show error message if the transaction fails
      setError('Transaction failed.');
      setTimeout(() => setError(''), 4000);
    } finally {
      // Reset form fields and error state
      setConfirmedAccountNumber('');
      setIfscCode('');
      setAmount('');
      setTransactionInProgress(false);
    }
  };
  const handleConfirmedAccountNumberChange = (event) => {
    setConfirmedAccountNumber(event.target.value);
  };
  const handleIfscCodeChange = (event) => {
    setIfscCode(event.target.value);
  };
 
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
 
  const handleConfirmTransaction = async () => {
    try {
      // Proceed with the transaction
      await handleSubmit();
    } catch (error) {
      // Show error message if the transaction fails
      setError('Transaction failed.');
    }
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
        <h1>Bank Transfer</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="confirmedAccountNumber">Account Number:</label>
            <input
              type="text"
              id="confirmedAccountNumber"
              value={confirmedAccountNumber}
              onChange={handleConfirmedAccountNumberChange}
              required
            />
          </div>
          <div>
            <label htmlFor="ifscCode">IFSC Code:</label>
            <input
              type="text"
              id="ifscCode"
              value={ifscCode}
              onChange={handleIfscCodeChange}
              required
            />
          </div>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              required
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {confirmationDialogOpen && (
            <div>
              <p>Are you sure you want to transfer?</p>
              <button onClick={handleConfirmTransaction}>Yes</button>
              <button onClick={() => setConfirmationDialogOpen(false)}>
                No
              </button>
            </div>
          )}
          {successMessage && (
            <div style={{ color: "green" }}>{successMessage}</div>
          )}
          <button type="submit">Submit</button>
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

export default BankTransfer;

// import React, { useState } from "react";
// import { getDataFromLocalStorage } from "./localstorage";
// import Logo from "./logo-no-background.png";
// import "../Styles/navbar.css";
// import "../Styles/index.css";

// function BankTransfer() {
//   const [accountNumber, setAccountNumber] = useState("");
//   const [IFSCcode, setIFSCcode] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [balance, setBalance] = useState(false);

//   const handleTransfer = () => {
//     if (!accountNumber || !IFSCcode || !amount) {
//       setMessage("Please fill in all fields.");
//       return;
//     }
//     console.log(IFSCcode);
//     const url = `https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${IFSCcode}`;
//     fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Bank not found.");
//         }
//         return response.json();
//       })
//       .then(
//         (data) => {
//           console.log(data);
//           if (!data || !data.fields) {
//             throw new Error("Bank data not found");
//           }

//           const accountData = data.fields;
//           const apiKey = accountData.domain_name.stringValue;
//           console.log(apiKey);

//           fetch(
//             `https://firestore.googleapis.com/v1/projects/${apiKey}/databases/(default)/documents/Account`
//           )
//             .then((response) => {
//               if (!response.ok) {
//                 throw new Error(
//                   "Error while fetching details from receiver account collection"
//                 );
//               }
//               return response.json();
//             })
//             .then((data) => {
//               console.log(data);
//               if (data.documents.length === 0) {
//                 throw new Error("No data found in the account collection");
//               }

//               for (const document of data.documents) {
//                 const docId = document.name.split("/").pop();
//                 const accountData = document.fields;
//                 if (accountData.accountNumber.integerValue === accountNumber) {

//                   fetch(
//                     `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails`
//                   )
//                     .then((response) => {
//                       if (!response.ok) {
//                         throw new Error("Sender collection is not found");
//                       }
//                       return response.json();
//                     })
//                     .then((data) => {
//                       if (data.documents.length === 0) {
//                         throw new Error(
//                           "No data found in the customerDetails Collection"
//                         );
//                       }
//                       for (const document of data.documents) {
//                         const senderId = document.name.split("/").pop();
//                         const senderData = document.fields;
//                         console.log(accountNumber);
//                         console.log(senderData.accountNumber.integerValue);
//                         if (
//                           senderData.accountNumber.integerValue ===
//                           getDataFromLocalStorage("accountNumber")
//                         ) {
//                           const oldBalance2 = parseInt(
//                             senderData.balance.doubleValue ||
//                               senderData.balance.integerValue
//                           );
//                           if (parseInt(amount) > oldBalance2) {
//                             setMessage("Insufficient Balance");
//                           } else {
//                             setBalance(true);
//                             console.log(balance);
//                             console.log(oldBalance2, parseInt(amount));
//                             const updatedBalance2 =
//                               oldBalance2 - parseInt(amount);

//                             console.log(updatedBalance2);

//                             const updatedAccountData2 = {
//                               ...senderData,
//                               balance: { doubleValue: updatedBalance2 },
//                             };

//                             console.log(updatedAccountData2);
//                             fetch(
//                               `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/customerDetails/${senderId}`,
//                               {
//                                 method: "PATCH",
//                                 headers: {
//                                   "Content-Type": "application/json",
//                                 },
//                                 body: JSON.stringify({
//                                   fields: updatedAccountData2,
//                                 }),
//                               }
//                             ).catch((error) => {
//                               console.error("Error :", error);
//                             });
//                           }
//                         }
//                       }
//                     });

//                   fetch(
//                     `https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Transactions`,
//                     {
//                       method: "POST",
//                       headers: {
//                         "Content-Type": "application/json",
//                       },
//                       body: JSON.stringify({
//                         fields: {
//                           senderAccountNumber: {
//                             integerValue:
//                               getDataFromLocalStorage("accountNumber"),
//                           },
//                           receiverAccountNumber: {
//                             integerValue: accountNumber,
//                           },
//                           type: {
//                             stringValue: "Debit",
//                           },
//                           amount: {
//                             doubleValue: parseInt(amount),
//                           },
//                           timestamp: {
//                             timestampValue: new Date().toISOString(),
//                           },
//                         },
//                       }),
//                     }
//                   );

//                   fetch(
//                     `https://firestore.googleapis.com/v1/projects/${apiKey}/databases/(default)/documents/Transactions`,
//                     {
//                       method: "POST",
//                       headers: {
//                         "Content-Type": "application/json",
//                       },
//                       body: JSON.stringify({
//                         fields: {
//                           senderAccountNumber: {
//                             integerValue:
//                               getDataFromLocalStorage("accountNumber"),
//                           },
//                           receiverAccountNumber: {
//                             integerValue: accountNumber,
//                           },
//                           type: {
//                             stringValue: "Credit",
//                           },
//                           amount: {
//                             doubleValue: parseInt(amount),
//                           },
//                           timestamp: {
//                             timestampValue: new Date().toISOString(),
//                           },
//                         },
//                       }),
//                     }
//                   );

//                   console.log("inside the balance true");
//                     const oldBalance = parseInt(
//                       accountData.balance.doubleValue ||
//                         accountData.balance.integerValue
//                     );
//                     const updatedBalance = parseInt(amount) + oldBalance;

//                     const updatedAccountData = {
//                       ...accountData,
//                       balance: { doubleValue: updatedBalance },
//                     };

//                     console.log(updatedAccountData);
//                     // return fetch(
//                     //   `https://firestore.googleapis.com/v1/projects/${apiKey}/databases/(default)/documents/Amount/${docId}`,
//                     //   {
//                     //     method: "PATCH",
//                     //     headers: {
//                     //       "Content-Type": "application/json",
//                     //     },
//                     //     body: JSON.stringify({
//                     //       fields: updatedAccountData,
//                     //     }),
//                     //   }
//                     // );

//                     fetch(`https://firestore.googleapis.com/v1/projects/${apiKey}/databases/(default)/documents/Amount`)
//                     .then((response) => {
//                       if (!response.ok) {
//                         throw new Error(
//                           "Error while fetching details from receiver account collection"
//                         );
//                       }
//                       return response.json();
//                     })
//                     .then((data) => {
//                       if(data.documents.length === 0)
//                       {
//                         throw new Error("data not found");
//                       }
//                       for (const document of data.documents) {
//                         const docId = document.name.split("/").pop();
//                         const accountData = document.fields;
//                         if (accountData.accountNumber.integerValue === accountNumber) {

//                         }
//                       }
//                     })

//                     return;
//                 }
//               }
//             })
//             .then((response) => {
//               if (!response.ok) {
//                 throw new Error("Transaction unsuccessful. Please try again.");
//               }
//               setMessage("Transaction successful!");
//             })
//             .catch((error) => {
//               setMessage(error.message);
//             });
//         }
//       )
//       .catch((error) => {
//         console.error("Error:", error);
//         setMessage(error.message);
//       });
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
//       <div className="main-container inside-form">
//         <h2>Transferring Money</h2>
//         <div className="textleft">
//           <label>Receving Account Number: </label>
//           <input
//             type="text"
//             placeholder="Enter the Account Number"
//             value={accountNumber}
//             onChange={(e) => setAccountNumber(e.target.value)}
//           />
//           <br />
//           <label>IFSC code: </label>
//           <input
//             type="text"
//             placeholder="Enter the IFSC code"
//             value={IFSCcode}
//             onChange={(e) => setIFSCcode(e.target.value)}
//           />
//           <br />
//           <label>Amount: </label>
//           <input
//             type="text"
//             placeholder="Enter the Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//           <br />
//         </div>
//         <button className="btn" onClick={handleTransfer}>
//           Send Amount
//         </button>
//         {message && <p>{message}</p>}
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
//             <address>001, XYZ street, Tambaram, Chennai.</address>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BankTransfer;
