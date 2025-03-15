import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Public_layout from "./layouts/Public_layout";
import Homepage from "./routes/Homepage";
import Auth_layout from "./layouts/Auth_layout";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* //public route */}
          <Route element={<Public_layout />}>
            <Route index element={<Homepage />} />
            {/* <Route path="/" element={<Homepage />} /> both are same */}
            </Route>


{/* auth protected route */}

<Route element= {<Auth_layout/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/signup" element={<Signup/>}/>

          {/* protected route */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
