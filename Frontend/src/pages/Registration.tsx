import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
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
