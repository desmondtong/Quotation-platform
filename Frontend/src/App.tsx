import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { appPaths } from "./appPath";
import UserContext from "./context/user";
import { Claims } from "./interfaces";

import Login from "./pages/Login";
import Project from "./pages/Project";
import ProjectDetail from "./pages/ProjectDetail";
import Quotation from "./pages/Quotation";
import QuotationDetail from "./pages/QuotationDetail";
import Registration from "./pages/Registration";

function App() {
  const initAccessToken = JSON.parse(localStorage.getItem("accessToken")!);
  const initClaims = JSON.parse(localStorage.getItem("claims")!);

  const [accessToken, setAccessToken] = useState<string>(initAccessToken);
  const [claims, setClaims] = useState<Claims>(initClaims);

  return (
    <div>
      <UserContext.Provider
        value={{ accessToken, setAccessToken, claims, setClaims }}
      >
        <Routes>
          <Route path={appPaths.login} element={<Login />}></Route>
          <Route
            path={appPaths.registration}
            element={<Registration />}
          ></Route>

          {claims != null && (
            <>
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
            </>
          )}
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
