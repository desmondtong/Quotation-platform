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
import { appPaths } from "../appPath";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import UserInfo from "../components/UserInfo";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { FetchedData, data } from "../interfaces";
import CreationModal from "../components/CreationModal";

const Project: React.FC = () => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const [projects, setProjects] = useState<FetchedData[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

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
          <UserInfo></UserInfo>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <SearchBar></SearchBar>
            {userCtx?.claims.role == "CUSTOMER" && (
              <Button
                variant="contained"
                onClick={() => setOpenCreateModal(true)}
              >
                + New Project
              </Button>
            )}
          </Stack>

          <TableContainer component={Paper} elevation={0} sx={{ mt: "1.5rem" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="body1">Project ID</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Project Name</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Date</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Nos. of Item</Typography>
                  </TableCell>
                  {userCtx?.claims.role == "CUSTOMER" ? (
                    <TableCell align="center">
                      <Typography variant="body1">Status</Typography>
                    </TableCell>
                  ) : (
                    <TableCell align="center">
                      <Typography variant="body1">Company</Typography>
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
                    <TableCell align="center">
                      <Typography variant="body1" color="var(--darkblue)">
                        #{row.project_id}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {row.project_name}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="light">
                        {new Date(row.datetime!).toDateString().slice(4)}
                        {", "}
                        {new Date(row.datetime!).toTimeString().slice(0, 5)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.items?.length}
                      </Typography>
                    </TableCell>

                    {userCtx?.claims.role == "CUSTOMER" ? (
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color={
                            row.is_active
                              ? "var(--green)"
                              : "var(--lightgrey-text)"
                          }
                        >
                          {row.is_active ? "Active" : "Inactive"}
                        </Typography>
                      </TableCell>
                    ) : (
                      <TableCell align="center">
                        <Typography variant="body2">
                          {row.customer_company}
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

      <CreationModal
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
        getAllCustomerProjects={getAllCustomerProjects}
      ></CreationModal>
    </>
  );
};

export default Project;
