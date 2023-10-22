import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// import jwtDecode from "jwt-decode";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { appPaths } from "../appPath";

// import UserContext from "../context/user";
// import useFetch from "../hooks/useFetch";
// import { data } from "../interfaces";

const Login: React.FC = () => {
  //   const fetchData = useFetch();
  const navigate = useNavigate();
  //   const userCtx = useContext(UserContext);

  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");

  const pathName = window.location.pathname;

  // function
  //   const handleLogin = async () => {
  //     const res: data = await fetchData("/auth/login", "POST", {
  //       email,
  //       password,
  //     });

  //     if (res.ok) {
  //       const decoded: any = jwtDecode(res.data?.access);

  //       const role = decoded.role;

  //       // check if user login using the correct login portal
  //       if (
  //         (role === "CUSTOMER" && pathName === "/login") ||
  //         ((role === "VENDOR" || role === "ADMIN") &&
  //           pathName === "/login/vendor")
  //       ) {
  //         userCtx?.setAccessToken(res.data?.access);
  //         localStorage.setItem("accessToken", JSON.stringify(res.data?.access));

  //         userCtx?.setRefreshToken(res.data?.refresh);
  //         localStorage.setItem("refreshToken", JSON.stringify(res.data?.refresh));

  //         userCtx?.setUserId(decoded.id);
  //         localStorage.setItem("userId", JSON.stringify(decoded.id));

  //         userCtx?.setRole(decoded.role);
  //         localStorage.setItem("role", JSON.stringify(decoded.role));

  //         if (role === "CUSTOMER") {
  //           userCtx?.setCustomerClaims({
  //             cart_id: decoded.cart_id,
  //             name: `${decoded.first_name} ${decoded.last_name}`,
  //             contact: decoded.contact,
  //             email: decoded.email,
  //           });
  //           localStorage.setItem(
  //             "customerClaims",
  //             JSON.stringify({
  //               cart_id: decoded.cart_id,
  //               name: `${decoded.first_name} ${decoded.last_name}`,
  //               contact: decoded.contact,
  //               email: decoded.email,
  //             })
  //           );
  //         } else if (role === "VENDOR") {
  //           userCtx?.setVendorClaims({
  //             address: decoded.address,
  //             postal_code: decoded.postal_code,
  //             store_name: decoded.store_name,
  //             category: decoded.category,
  //             contact: decoded.contact,
  //             description: decoded.description,
  //             email: decoded.email,
  //           });
  //           localStorage.setItem(
  //             "vendorClaims",
  //             JSON.stringify({
  //               address: decoded.address,
  //               postal_code: decoded.postal_code,
  //               store_name: decoded.store_name,
  //               category: decoded.category,
  //               contact: decoded.contact,
  //               description: decoded.description,
  //               email: decoded.email,
  //             })
  //           );
  //         }

  //         navigate(`/`);
  //       } else {
  //         alert("Please login with the correct portal!");
  //       }
  //     } else {
  //       alert(JSON.stringify(res.data));
  //     }
  //   };

  return (
    <>
      <Grid container alignItems="center" height="100vh">
        <Grid item container xs={12} justifyContent="center">
          <Box mx="6rem" width="25%">
            <Typography
              variant="h3"
              align="left"
              fontWeight="bold"
              color="var(--orange)"
            >
              Welcome Back!
            </Typography>
            <Typography variant="body1" mb="2rem">
              Please enter your login details
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: "3rem", mb: "1rem" }}
              // onClick={handleLogin}
              color="warning"
            >
              LOG IN
            </Button>

            <Grid item>
              <Box>
                <Typography
                  variant="body1"
                  fontSize="0.8rem"
                  textAlign="center"
                >
                  Don't have an account?
                  <Link
                    href={appPaths.registration}
                    variant="body2"
                    ml="0.3rem"
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default Login;
