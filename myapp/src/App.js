import React, { useState } from 'react';
import Calendar from './home';
const axios = require('axios');

const Login = () => {
  const [email, setEmail] = useState("gonekaverireddy1408@gmail.com");
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmitEmail = async () => {
    console.log("in sending mail ", email);
    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email in the request body
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Error sending OTP:', response.status);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleSubmitOTP = async () => {
    console.log("in submitotp:",otp);
    try {
      const response = await fetch("http://localhost:5000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp,email }), // Send entered OTP to the server
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        window.localStorage.setItem("token", data.data);
        window.location.href = "/book-slot";
      } else {
        console.error('Error verifying otp:', response.status);
      }
      
    } catch (error) {
      setError('Invalid OTP');
    }
  };
  return (
    <div >
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br></br>
      <button onClick={handleSubmitEmail}>Send OTP</button>
      <br></br>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <br></br>
      <button onClick={handleSubmitOTP}>Submit OTP</button>
    </div>
  );
}

export default Login;
