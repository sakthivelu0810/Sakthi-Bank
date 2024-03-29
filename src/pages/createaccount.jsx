import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import {
  saveDataToLocalStorage,
  getDataFromLocalStorage,
  clearLocalStorage,
} from "./localstorage";
import Logo from "./logo-no-background.png";
import "../Styles/navbar.css";
import "../Styles/index.css";
import "../Styles/insideform.css";

// Initialize Firebase app
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

const storage = firebase.storage();

function CreateAccountPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [voterId, setVoterId] = useState(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const docRef = await firebase
          .firestore()
          .collection("customerDetails")
          .doc(requestId);
        docRef.onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setStatus(data.status);
            if (data.status === "approved") {
              setAccountNumber(data.accountNumber);
              // localStorage.setItem('accno',data.accountNumber);
              saveDataToLocalStorage("accno", data.accountNumber);
            }
          }
        });
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    if (requestId) {
      checkStatus();
    }
  }, [requestId]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    // localStorage.setItem('name',e.target.value);
    saveDataToLocalStorage("name", e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleOccupationChange = (e) => {
    setOccupation(e.target.value);
  };

  const handleAadharCardChange = (e) => {
    setAadharCard(e.target.files[0]);
  };

  const handlePanCardChange = (e) => {
    setPanCard(e.target.files[0]);
  };

  const handleVoterIdChange = (e) => {
    setVoterId(e.target.files[0]);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    return fileRef.getDownloadURL();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if all fields are filled
    if (
      !name ||
      !age ||
      !occupation ||
      !aadharCard ||
      !panCard ||
      !voterId ||
      !email ||
      !phoneNumber
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    try {
      const aadharCardUrl = await uploadFile(aadharCard);
      const panCardUrl = await uploadFile(panCard);
      const voterIdUrl = await uploadFile(voterId);

      const docRef = await firebase
        .firestore()
        .collection("customerDetails")
        .add({
          name,
          age,
          occupation,
          aadharCardUrl,
          panCardUrl,
          voterIdUrl,
          email,
          phoneNumber,
          status: "pending", // Initial status
        });

      setIsSubmitted(true);
      setErrorMessage("");
      setRequestId(docRef.id);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Failed to submit. Please try again later.");
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
      <div className="main-container inside-form">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              id="name"
              value={getDataFromLocalStorage("name")}
              onChange={handleNameChange}
            />
          </div>
          <div>
            <label htmlFor="age">Date of Birth : </label>
            <input
              type="date"
              id="age"
              value={age}
              onChange={handleAgeChange}
            />
          </div>
          <div>
            <label htmlFor="occupation">Occupation : </label>
            <input
              type="text"
              id="occupation"
              value={occupation}
              onChange={handleOccupationChange}
            />
          </div>
          <div>
            <label htmlFor="aadharCard">Aadhar Card: </label>
            <input
              type="file"
              id="aadharCard"
              accept="image/*"
              onChange={handleAadharCardChange}
            />
          </div>
          <div>
            <label htmlFor="panCard">PAN Card : </label>
            <input
              type="file"
              id="panCard"
              accept="image/*"
              onChange={handlePanCardChange}
            />
          </div>
          <div>
            <label htmlFor="voterId">Voter ID : </label>
            <input
              type="file"
              id="voterId"
              accept="image/*"
              onChange={handleVoterIdChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              id="email"
              value={getDataFromLocalStorage("email")}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number : </label>
            <input
              type="text"
              id="phoneNumber"
              value={getDataFromLocalStorage("phoneNumber")}
              onChange={handlePhoneNumberChange}
            />
          </div>
          <button className="btn" type="submit">Submit</button>
        </form>
        {status === "approved" && (
          <p>
            Your request is approved. Your account number is: {accountNumber}
          </p>
        )}
        {status === "rejected" && <p>Your request is rejected.</p>}
        {status === "pending" && isSubmitted && (
          <p>Your request is pending approval.</p>
        )}
        {errorMessage && <p>{errorMessage}</p>}
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

export default CreateAccountPage;
