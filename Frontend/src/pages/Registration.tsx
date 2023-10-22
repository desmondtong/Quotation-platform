import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import jwtDecode from "jwt-decode";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { MenuItem, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

// import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { data } from "../interfaces";
import { appPaths } from "../appPath";

const Registration: React.FC = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  // const userCtx = useContext(UserContext);

  const [roles, setRoles] = useState<string[]>([]);
  const [name, setName] = useState<String>("");
  const [company, setCompany] = useState<String>("");
  const [role, setRole] = useState<String>("");
  const [address, setAddress] = useState<String>("");
  const [postalCode, setPostalCode] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [contact, setContact] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [confirmPassword, setConfirmPassword] = useState<String>("");
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);

  const pathName = window.location.pathname;

  // endpoint
  const getRoles = async () => {
    const res: data = await fetchData("/api/constraints/roles", "GET");
    
    if (res.ok) {
      setRoles(res.data);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  const handleRegister = async () => {
    // if (password != confirmPassword) {
    //   return setWrongPassword(true);
    // } else {
    //   setWrongPassword(false);
    // }
    // // construct body for endpoint for different role
    // const body: registerBody = {
    //   role: pathName === "/registration/vendor" ? "VENDOR" : "CUSTOMER",
    //   email,
    //   password,
    //   contact,
    // };
    // if (pathName === "/registration/vendor") {
    //   body["category"] = category;
    //   body["store_name"] = storeName;
    //   body["address"] = address;
    //   body["postal_code"] = postalCode;
    // } else {
    //   body["first_name"] = firstName;
    //   body["last_name"] = lastName;
    // }
    // const res: data = await fetchData("/auth/register", "PUT", body);
    // if (res.ok) {
    //   // Login user after register successful
    //   const resLogin: data = await fetchData("/auth/login", "POST", {
    //     email,
    //     password,
    //   });
    //   if (resLogin.ok) {
    //     const decoded: any = jwtDecode(resLogin.data?.access);
    //     const role = decoded.role;
    //     // check if user login using the correct login portal
    //     userCtx?.setAccessToken(resLogin.data?.access);
    //     localStorage.setItem(
    //       "accessToken",
    //       JSON.stringify(resLogin.data?.access)
    //     );
    //     userCtx?.setRefreshToken(resLogin.data?.refresh);
    //     localStorage.setItem(
    //       "refreshToken",
    //       JSON.stringify(resLogin.data?.refresh)
    //     );
    //     userCtx?.setUserId(decoded.id);
    //     localStorage.setItem("userId", JSON.stringify(decoded.id));
    //     userCtx?.setRole(decoded.role);
    //     localStorage.setItem("role", JSON.stringify(decoded.role));
    //     if (role === "CUSTOMER") {
    //       userCtx?.setCustomerClaims({
    //         cart_id: decoded.cart_id,
    //         name: `${decoded.first_name} ${decoded.last_name}`,
    //       });
    //       localStorage.setItem(
    //         "customerClaims",
    //         JSON.stringify({
    //           cart_id: decoded.cart_id,
    //           name: `${decoded.first_name} ${decoded.last_name}`,
    //         })
    //       );
    //     } else if (role === "VENDOR") {
    //       userCtx?.setVendorClaims({
    //         address: decoded.address,
    //         postal_code: decoded.postal_code,
    //         store_name: decoded.store_name,
    //         category: decoded.category,
    //       });
    //       localStorage.setItem(
    //         "vendorClaims",
    //         JSON.stringify({
    //           address: decoded.address,
    //           postal_code: decoded.postal_code,
    //           store_name: decoded.store_name,
    //           category: decoded.category,
    //         })
    //       );
    //     }
    //     navigate(`/`);
    //   } else {
    //     alert(JSON.stringify(resLogin.data));
    //   }
    // } else {
    //   alert(JSON.stringify(res.data));
    // }
  };

  useEffect(() => {
    getRoles();
  }, []);
  return (
    <>
      <Grid container alignItems="center" height="100vh">
        <Grid item container xs={12} justifyContent="center">
          <Box mx="6rem" width="25%">
            <Typography
              variant="h3"
              align="left"
              fontWeight="bold"
              gutterBottom
              mb="2rem"
              color="var(--orange)"
            >
              Register
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="none"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="none"
                  required
                  fullWidth
                  name="company"
                  label="Company"
                  type="text"
                  id="company"
                  onChange={(e) => setCompany(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="none"
                  select
                  required
                  fullWidth
                  name="role"
                  label="Account Type"
                  type="role"
                  id="role"
                  defaultValue=""
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roles.map((item, idx) => (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="none"
                  required
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  id="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="none"
                  required
                  fullWidth
                  name="phone number"
                  label="Phone Number"
                  id="phoneNumber"
                  autoComplete="phone number"
                  onChange={(e) => setContact(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="none"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={wrongPassword}
                  margin="none"
                  required
                  fullWidth
                  name="confirm password"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  helperText={wrongPassword && "Password does not match!"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: "3rem", mb: "1rem" }}
              onClick={handleRegister}
              color="warning"
            >
              CREATE ACCOUNT
            </Button>

            <Grid item>
              <Box>
                <Typography
                  variant="body1"
                  fontSize="0.8rem"
                  textAlign="center"
                >
                  Already have an account?
                  <Link href={appPaths.login} variant="body2" ml="0.3rem">
                    Login Now
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
export default Registration;
