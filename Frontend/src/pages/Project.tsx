import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import UserContext from "../context/user";
import { FetchedData, data } from "../interfaces";
import useFetch from "../hooks/useFetch";
import { appPaths } from "../appPath";

const Project: React.FC = () => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const [projects, setProjects] = useState<FetchedData[]>([]);

  // endpoint
  const getAllCustomerProjects = async () => {
    const res: data = await fetchData(
      "/api/projects-items/" + userCtx?.claims.user_id,
      "GET",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      setProjects(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  const getAllProjects = async () => {
    const res: data = await fetchData(
      "/api/projects-items",
      "GET",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      setProjects(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  // const datetime = "2023-10-21T07:45:09.000Z";
  // const date = new Date(datetime).toDateString().slice(4);
  // const time = new Date(datetime).toTimeString().slice(0, 5);

  useEffect(() => {
    userCtx?.claims.role == "CUSTOMER" && getAllCustomerProjects();
    userCtx?.claims.role == "SUPPLIER" && getAllProjects();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <NavBar></NavBar>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Typography
            variant="h5"
            gutterBottom
          >{`Welcome back, ${userCtx?.claims.name}!`}</Typography>

          {userCtx?.claims.role == "CUSTOMER" && (
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained">+ New Project</Button>
            </Stack>
          )}

          <TableContainer component={Paper} elevation={0} sx={{ mt: "1.5rem" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">Project Name</Typography>
                  </TableCell>
                  <TableCell width="20%" align="center">
                    <Typography variant="body1">Project ID & Date</Typography>
                  </TableCell>
                  <TableCell width="20%" align="center">
                    <Typography variant="body1">Nos. of Item</Typography>
                  </TableCell>
                  {userCtx?.claims.role == "CUSTOMER" && (
                    <TableCell width="20%" align="center">
                      <Typography variant="body1">Status</Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {projects.map((row, idx) => (
                  <TableRow
                    hover
                    key={idx}
                    onClick={() =>
                      navigate(appPaths.project + "/" + row.project_id)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={2}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {row.project_name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="column">
                        <Typography variant="body2" color="var(--darkblue)">
                          #{row.project_id}
                        </Typography>
                        <Typography variant="body2" fontWeight="light">
                          {new Date(row.datetime!).toDateString().slice(4)}

                          {/* only show time for CUSTOMER */}
                          {userCtx?.claims.role == "CUSTOMER" && (
                            <>
                              ,{" "}
                              {new Date(row.datetime!)
                                .toTimeString()
                                .slice(0, 5)}
                            </>
                          )}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.items?.length}
                      </Typography>
                    </TableCell>

                    {userCtx?.claims.role == "CUSTOMER" && (
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color={
                            row.is_active === 1
                              ? "var(--green)"
                              : "var(--lightgrey-text)"
                          }
                        >
                          {row.is_active == 1 ? "Active" : "Inactive"}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default Project;
