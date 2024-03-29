import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  saveDataToLocalStorage,
  getDataFromLocalStorage,
  clearLocalStorage,
  setCookie,
} from "./localstorage";
import "../Styles/index.css";
import "../Styles/form.css";

function MainComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null); // Initialize userId state
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    saveDataToLocalStorage("email", email);
    // setCookie('email',email,1);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      fetch(
        "https://firestore.googleapis.com/v1/projects/bankdatabase-2791f/databases/(default)/documents/Users"
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Collection not found");
            return;
          }
          return response.json();
        })
        .then((data) => {
          // const filteredData = data.documents.filter(doc => doc.fields.email.stringValue === getDataFromLocalStorage("email"));
          // console.log(filteredData);
          // const userData = data.documents.find(
          //   (doc) => doc.fields.email.stringValue === email
          // );
          // if (userData) {
          //   const name = userData.fields.name.stringValue;
          //   const phoneNumber = userData.fields.phoneNumber.stringValue;

          //   // Storing name and phoneNumber separately in local storage
          //   saveDataToLocalStorage("name", name);
          //   saveDataToLocalStorage("phoneNumber", phoneNumber);
          // }
          let userData;
          for (const doc of data.documents) {
            if (doc.fields.email.stringValue === email) {
              userData = doc;
              break;
            }
          }

          if (userData) {
            const name = userData.fields.name.stringValue;
            const phoneNumber = userData.fields.phoneNumber.stringValue;

            // Storing name and phoneNumber separately in local storage
            saveDataToLocalStorage("name", name);
            saveDataToLocalStorage("phoneNumber", phoneNumber);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));

      const user = userCredential.user;
      console.log("Signin successful:", user);

      // Store user ID
      setUserId(user.uid);

      // Redirect based on email
      if (email === "svelu107@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSignin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            Sign In
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default MainComponent;
