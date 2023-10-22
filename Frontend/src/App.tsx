import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Project from "./pages/Project";
import Quotation from "./pages/Quotation";
import ProjectDetail from "./pages/ProjectDetail";
import QuotationDetail from "./pages/QuotationDetail";
// import { useState } from 'react'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Registration />}></Route>

        <Route path="/project" element={<Project />}></Route>
        <Route path="/project/:projectId" element={<ProjectDetail />}></Route>

        {/* page to add project/quotation */}

        <Route path="/quotation" element={<Quotation />}></Route>
        <Route
          path="/quotation/:quotationId"
          element={<QuotationDetail />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
