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
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { FetchedData, data } from "../interfaces";

const ProjectDetail: React.FC = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const params = useParams();

  const [projectDetails, setProjectDetails] = useState<FetchedData>({});

  const datetime = projectDetails.datetime;
  const date = new Date(datetime!).toDateString().slice(4);
  const time = new Date(datetime!).toTimeString().slice(0, 5);

  // endpoint
  const getProjectDetails = async () => {
    const res: data = await fetchData(
      "/api/projects-items/" + params.projectId,
      "POST",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      setProjectDetails(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    getProjectDetails();
  }, []);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <NavBar></NavBar>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          {/* Project details */}
          <Stack direction="column">
            <Typography variant="h4" gutterBottom>
              Project Details
            </Typography>
            <Stack direction="row" spacing={1}>
              <Typography>Project ID:</Typography>
              <Typography fontWeight="light">#{params.projectId}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography>Project Name:</Typography>
              <Typography fontWeight="light">
                {projectDetails.project_name}
              </Typography>
            </Stack>

            {userCtx?.claims.role == "SUPPLIER" && (
              <>
                <Stack direction="row" spacing={1}>
                  <Typography>Client:</Typography>
                  <Typography fontWeight="light">
                    {projectDetails.customer_company}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography>Email:</Typography>
                  <Typography fontWeight="light">
                    {projectDetails.customer_email}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography>Phone Number:</Typography>
                  <Typography fontWeight="light">
                    {projectDetails.customer_phone_number}
                  </Typography>
                </Stack>
              </>
            )}

            <Stack direction="row" spacing={1}>
              <Typography>Created On:</Typography>
              <Typography fontWeight="light">
                {date}
                {", "}
                {time}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography>Status:</Typography>
              <Typography
                fontWeight="light"
                color={
                  projectDetails.is_active
                    ? "var(--green)"
                    : "var(--lightgrey-text)"
                }
              >
                {projectDetails.is_active ? "Active" : "Inactive"}
              </Typography>
            </Stack>
          </Stack>

          {/* Item list */}
          <TableContainer component={Paper} elevation={0} sx={{ mt: "1.5rem" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography>Item ID</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Item Name</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Technology</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Material</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Surface Finish</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Quantity</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">
                      {userCtx?.claims.role == "CUSTOMER" ? "Status" : ""}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {projectDetails.items?.map((row, idx) => (
                  <TableRow hover key={idx} sx={{ cursor: "pointer" }}>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="var(--darkblue)"
                      >
                        #{row.item_id}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">{row.item_name}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">{row.technology}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">{row.material}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.surface_finish}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">{row.quantity}</Typography>
                    </TableCell>

                    {userCtx?.claims.role == "CUSTOMER" ? (
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color={
                            row.status == "QUOTE ACCEPTED" ||
                            row.status == "COMPLETED"
                              ? "var(--green)"
                              : row.status === "OFFERED"
                              ? "var(--yellow)"
                              : "var(--lightgrey-text)"
                          }
                        >
                          {row.status}
                        </Typography>
                      </TableCell>
                    ) : (
                      <TableCell width="10%" align="center">
                        <Button variant="contained">View</Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action buttons */}
          {userCtx?.claims.role == "CUSTOMER" && (
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              mt="1rem"
            >
              <Button variant="contained">Update Project</Button>
              <Button variant="outlined" color="error">
                Delete Project
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ProjectDetail;
