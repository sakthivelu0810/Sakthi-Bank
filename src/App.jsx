// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AdminPage from './pages/AdminPage';
import ApproveAccountsPage from './pages/approveaccount';
import TransactionsPage from './pages/transactions';
import CustomerDetailsPage from './pages/customerdetail';
import ForgotPassword from './pages/forgotpassword';
import HomePage from './pages/CustomerPage';
import CreateAccountPage from './pages/createaccount';
// import sendApprovalEmail from './pages/emailService';

import LoginPage from './pages/login';
import CustomerPageMain from './pages/customer-page-main';
import LoanRequest from './pages/LoanRequest';
import Deposit from './pages/Deposit';
import ApproveLoanPage from './pages/LoanAdmin';
import BankTransfer from './pages/BankTransfer';
import UserAccount from './pages/useraccount';
import LoanDetailsPage from './pages/LoanDetails';
import CustomersTransactionsPage from './pages/customertransactions';
import MyaccountPage from './pages/myaccounts';


function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignupSuccess = () => {
    setIsSignedUp(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup onSignupSuccess={handleSignupSuccess} />} />
        <Route path="/admin" element={<AdminPage />}/>
        <Route path="/approve-accounts" element={<ApproveAccountsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/customer-details" element={<CustomerDetailsPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/customer-page-main" element={<CustomerPageMain/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/Loan-request" element={< LoanRequest />}/>
        <Route path="*" element={<Signup onSignupSuccess={handleSignupSuccess} />} />
        <Route path="/deposit" element={<Deposit />}></Route>
        <Route path="/Loan-admin" element={<ApproveLoanPage />}></Route>
        <Route path="/banktransfer" element={<BankTransfer />}></Route>
        <Route path="/useraccount" element={<UserAccount />}></Route>
        <Route path="/loandetails" element={<LoanDetailsPage />}></Route>
        <Route path="/customer-transactions" element={<CustomersTransactionsPage />}></Route>
        <Route path="/myaccounts" element={<MyaccountPage />}></Route>

      </Routes>
    </Router>
  );
}

export default App;
