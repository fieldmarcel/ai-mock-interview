import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/Public_layout";
import Homepage from "./routes/Homepage";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* //public route */}
          <Route element={<PublicLayout />}>
            <Route index element={<Homepage />} />
            {/* <Route path="/" element={<Homepage />} /> both are same */}

          </Route>
          {/* protected route */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
