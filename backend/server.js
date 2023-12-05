const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const twoFARoutes = require("./routes/2faRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const errorHandler = require("./middleware/errorHandler");
const session = require("express-session");
const passport = require("./config/passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Professional = require("./models/Professional");
const adminRoutes = require('./routes/adminRoutes');

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AdminLogin from './path/to/AdminLogin'; // Update with the correct path to your AdminLogin component
// import OtherComponent from './path/to/OtherComponent'; // Import other components as needed

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/admin-login" element={<AdminLogin />} />
//         {/* Add other routes here */}
//         {/* <Route path="/other-path" element={<OtherComponent />} /> */}
//         {/* ... */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

console.log("Started backend server");

// Connect to mongoose
connectDB();

// Enable CORS for all routes
app.use("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/admin', adminRoutes);
// Session Middleware Initialization with secure cookie settingsTab
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    secret:"kokijaAe4e5dtmk",
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      httpOnly: true,
      sameSite: "Strict",
    },
  })
);

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use('/auth', authRoutes);
app.use("/api/v1/auth/2fa", twoFARoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// Error handler to be placed last
app.use(errorHandler);
// const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
  console.log(`Server is running on http://localhost:8000`);
});

/*
Request Queue

Proffestional Trainer Side id(9012)
VideoId  DateRequested TimeRequested Status
re34r3r  12/12/2020      12:00       Pending

requestQueue = [{
    videoId: "re34r3r",
    dateRequested: "12/12/2020",
    timeRequested: "12:00",
    status: "Pending"
}]

admin approves the request
update adminsRequestQueue in mongodb
update requestQueue in mongodb

first update the adminsRequestQueue in mongodb status to approved

For updating proffestional side

fetch adminsRequestQueue from mongodb
find your id in the adminsRequestQueue
check if status is approved
requestQueue update that videoId status to approved
*/

// Recieving Requests from the proffestional trainer
// app.get("/request-admin", (req, res) => {
//   let proffestionalId = req.body.proffestionalId;
//   let videoRequest = req.body.videoRequest;
//   let date = req.body.date;
//   let time = req.body.time;
//   let status = req.body.status;
//   let videoId = req.body.videoId;
//   let requestQueue = {
//     proffestionalId: proffestionalId,
//     videoId: videoId,
//     dateRequested: date,
//     timeRequested: time,
//     status: status,
//     videoRequest: videoRequest,
//   };
//   Professional.findOneAndUpdate(
//     { _id: proffestionalId },
//     { $push: { requestQueue: requestQueue } }
//   );
// });

// app.get("/retrieve-all-requests", (req, res) => {
//   Professional.find({
//     requestQueue: { $exists: true, $ne: [] },
//   }).then((data) => {
//     res.send(data);
//   })}
// );

// app.get("/approve-request",(req,res)=>{
//     let videoId = req.body.videoId;
//     let proffestionalId = req.body.proffestionalId;
//     let proffestionalExists = Professional.findOne({_id: proffestionalId});
//     if(!proffestionalExists){
//         res.send("Proffestional does not exist");
//     }
//     Professional.findOneAndUpdate(
//         {_id: proffestionalId},
//         {$set: {"requestQueue.$[element].status": "Approved"}},
//         {arrayFilters: [{"element.videoId": videoId}]}
//     )
// })

// app.get("/decline-request",(req,res)=>{
//     let videoId = req.body.videoId;
//     let proffestionalId = req.body.proffestionalId;
//     let proffestionalExists = Professional.findOne({_id: proffestionalId});
//     if(!proffestionalExists){
//         res.send("Proffestional does not exist");
//     }
//     Professional.findOneAndUpdate(
//         {_id: proffestionalId},
//         {$set: {"requestQueue.$[element].status": "Declined"}},
//         {arrayFilters: [{"element.videoId": videoId}]}
//     )
// })

// app.get("delete-approved-request",(req,res)=>{
//     let videoId = req.body.videoId;
//     let proffestionalId = req.body.proffestionalId;
//     let proffestionalExists = Professional.findOne({_id: proffestionalId});
//     if(!proffestionalExists){
//         res.send("Proffestional does not exist");
//     }
//     Professional.findOneAndUpdate(
//         {_id: proffestionalId},
//         {$pull: {requestQueue: {videoId: videoId}}}
//     )
// })



// require("dotenv").config();
// const express = require("express");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const twoFARoutes = require("./routes/2faRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const searchRoutes = require("./routes/searchRoutes");
// const settingsRoutes = require("./routes/settingsRoutes");
// const errorHandler = require("./middleware/errorHandler");
// const session = require("express-session");
// const passport = require("./config/passport");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const adminRoutes = require('./routes/adminRoutes'); // Admin routes

// const app = express();
// console.log("Started backend server");

// // Connect to mongoose
// connectDB();

// // Enable CORS for all routes
// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());

// // Session Middleware Initialization with secure cookie settings
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
//       httpOnly: true,
//       sameSite: "Strict",
//     },
// }));

// // Initialize Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/auth/2fa", twoFARoutes);
// app.use("/api/v1/dashboard", dashboardRoutes);
// app.use("/api/v1/search", searchRoutes);
// app.use("/api/v1/settings", settingsRoutes);
// app.use('/api/admin', adminRoutes); // Use admin routes

// // Home route
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// // Error handler to be placed last
// app.use(errorHandler);

