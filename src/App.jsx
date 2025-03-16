import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./routes/Homepage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./routes/LoginPage";
import SignupPage from "./routes/SignupPage";
import User from "./routes"
import Protected from "./layouts/Protected-routes";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/" element={
              <div className="w-full">
                <Header />
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
         <Route path="/protected" element={
            <Protected/>
             
          } />
        
        </Routes>
      </Router>
    </div>
  );
};

export default App;
