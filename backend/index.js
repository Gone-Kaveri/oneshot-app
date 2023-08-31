const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// const dbusername=gonekaverireddy1408;
// const dbpwd=oneshot;
const dbUrl="mongodb+srv://gonekaverireddy1408:oneshot@cluster0.u66v98t.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require('mongoose');

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log("error:", e));


require('./booking');
const Booking = mongoose.model("bookings");


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service
  auth: {
    user: '20071A0577@vnrvjiet.in', // Your email
    pass: 'kawmpkhgluiraxtn' // Your email password or an app-specific password
  }
});

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
};

var sentotp=0;

const sendOTPEmail = async (email) => {
  console.log("in sendotp")
  sentotp = generateOTP();
  console.log("otp:",sentotp);
  const mailOptions = {
    from: '20071A0577@vnrvjiet.in',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${sentotp}`
  };

  try {
    console.log("send otp:in try")
    await transporter.sendMail(mailOptions);
    return sentotp;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

//API's
app.post('/send-otp', (req, res) => {
  // console.log("req",req);
  const {email}  = req.body;
  console.log("email:", email);
  try {
    console.log("in try")
    const otp = sendOTPEmail(email);
    res.json({ message: 'OTP sent successfully', otp:otp });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
  // res.json({ message: 'OTP sent successfully' });
});

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
//import java web token
const jwt = require("jsonwebtoken");

app.post('/verify', async(req, res) => {
  console.log("in verify");
  console.log("in verify-otp",req);
  const {otp,email}=req.body;
  console.log("userotp:",otp,typeof(otp)," otp sent:",sentotp,typeof(sentotp));
  if (otp === sentotp.toString()) {
    const token = jwt.sign({ User_id: email }, JWT_SECRET);
    res.json({ message: 'OTP verification successful',data:token });
  } else {
    res.status(400).json({ message: 'OTP verification failed' });
  }
});

app.post('/book-slot',async (req, res) => {
  const {selectedDate, token,name,contactNo}=req.body;
  
  const mail=jwt.verify(token, JWT_SECRET).User_id;
  console.log("in book-slot",selectedDate,mail,name,contactNo);
  const date = new Date(selectedDate);
  console.log("date", (date.getDate(),date.getMonth(),date.getFullYear()));
  const bookdate=date.getDate().toString()+(date.getMonth()+1).toString()+date.getFullYear().toString();
  console.log("date1",bookdate)
  try{
  await Booking.create({
    Name:name,
    Email:mail,
    BookTime:date,
    BookDate:bookdate,
    Contact:contactNo,
  });
  console.log("booking successful");
  res.json({ status: "ok" });
}
catch (error) {
  console.log("error:",error);
  res.status(500).json({ message: 'Error sending OTP' });
}

});

app.post('/getBookedSlots',async (req, res) => {
  const {selectedDate}=req.body;
  console.log("in getbookedslots",selectedDate);
  const start=new Date(selectedDate);
  const date=start.getDate().toString()+(start.getMonth()+1).toString()+start.getFullYear().toString();
  console.log("date",date,start);
  // start.setUTCHours(0, 0, 0, 0);
  // end.setUTCHours(23,59,59,999);
  // const query = {
  //   dateField: new Date(targetDate),
  // };

  // const projection = { field1: 1, field2: 1, _id: 0 }; // Include field1 and field2, exclude _id

  // const result = await collection.find(query, projection).toArray();
  try{
  const slots=await Booking.find({BookDate:"3182023"},{BookTime:1} );
  console.log("slots:",slots);
  res.json({ status: "ok" ,data:slots});
}
catch (error) {
  console.log("error:",error);
  res.status(500).json({ message: 'Error sending OTP' });
}

});




app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

