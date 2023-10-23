import jwtDecode from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { appPaths } from "../appPath";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { data } from "../interfaces";

const Registration: React.FC = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  const [roles, setRoles] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);

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
    // check if password matching before register user
    if (password != confirmPassword) {
      return setWrongPassword(true);
    } else {
      setWrongPassword(false);
    }

    const res: data = await fetchData("/auth/register", "PUT", {
      name,
      company,
      role,
      email,
      password,
      phone_number: contact,
    });

    if (res.ok) {
      // decode claim and save to localStorage & state
      const decoded: any = jwtDecode(res.data?.access);
      const claims = {
        user_id: decoded.user_id,
        email: decoded.email,
        name: decoded.name,
        company: decoded.company,
        role: decoded.role,
        phone_number: decoded.phone_number,
      };
      localStorage.setItem("claims", JSON.stringify(claims));
      userCtx?.setClaims(claims);

      // save access token to localStorage & state
      localStorage.setItem("accessToken", JSON.stringify(res.data.access));
      userCtx?.setAccessToken(res.data.access);

      navigate(appPaths.project);
    } else {
      alert(JSON.stringify(res.data));
    }
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
              color="var(--darkblue)"
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
