import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Whiteboard from "./components/Whiteboard";
import SignUp from "./components/SignUp";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { ReactFlowProvider } from "reactflow";
import FlowDetailsPage from "./components/FlowDetailsPage";

const App = () => {
  return (
    <ReactFlowProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Whiteboard />} />
            <Route path="/flow-details" element={<FlowDetailsPage />} />
          </Route>
        </Routes>
      </Router>
    </ReactFlowProvider>
  );
};

export default App;
