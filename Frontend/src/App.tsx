import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Project from "./pages/Project";
import Quotation from "./pages/Quotation";
import ProjectDetail from "./pages/ProjectDetail";
import QuotationDetail from "./pages/QuotationDetail";
import { appPaths } from "./appPath";

function App() {
  
  return (
    <div>
      <Routes>
        <Route path={appPaths.login} element={<Login />}></Route>
        <Route path={appPaths.registration} element={<Registration />}></Route>

        <Route path={appPaths.project} element={<Project />}></Route>
        <Route
          path={appPaths.projectDetail}
          element={<ProjectDetail />}
        ></Route>

        {/* page to add project/quotation */}

        <Route path={appPaths.quotation} element={<Quotation />}></Route>
        <Route
          path={appPaths.quotationDetail}
          element={<QuotationDetail />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
