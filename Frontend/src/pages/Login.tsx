import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { appPaths } from "../appPath";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { data } from "../interfaces";

const Login: React.FC = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");

  // function
  const handleLogin = async () => {
    const res: data = await fetchData("/auth/login", "PUT", {
      email,
      password,
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
      userCtx?.setAccessToken(res.data.accessToken);

      navigate(appPaths.project);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

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
              onClick={handleLogin}
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
