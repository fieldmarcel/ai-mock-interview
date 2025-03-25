import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./routes/Homepage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./routes/LoginPage";
import SignupPage from "./routes/SignupPage";
import User from "./routes/User"
import Dashboard from "./routes/Dashboard";
import InterviewPage from "./routes/InterviewPage";
// import CreateForm from "./routes/CreateEdit.jsx";
import AddNewInterview from "./components/AddNewInterview";
import StartInterview from "./routes/StartInterview";
// import Protected from "./layouts/Protected-routes";
// import Container from "./components/Container";
const App = () => {
  return (
    <div>
      <Router>       
           <Header />

        <Routes>
          {/* Public Routes */}

          <Route
            path="/" element={
              <div className="w-full">
                <Homepage />
                
                <Footer />
              </div>
            }
          />

          {/* Auth Protected Routes */}
          <Route
            path="/login" element={ <div><LoginPage /> </div> }/>
          <Route
            path="/signup" element={ <div><SignupPage /></div> }/>
          <Route
            path="/user" element={ <div><User /></div> }/>
        
        
         {/* Protected Route */}
         <Route path="/generate" element={<Dashboard/>} />
          <Route path="/generate/:create" element={<AddNewInterview />} />
          <Route path="/interview/:tempId" element={<InterviewPage />} />
          <Route path="/interview/:tempId/start" element={<StartInterview />} />


        </Routes>
      </Router>
    </div>
  );
};

export default App;
