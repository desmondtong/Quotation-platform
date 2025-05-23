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
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { FetchedData, data } from "../interfaces";
import QuotationList from "../components/QuotationList";
import { appPaths } from "../appPath";
import CreateQuotationModal from "../components/CreateQuotationModal";

const ProjectDetail: React.FC = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();

  const [projectDetails, setProjectDetails] = useState<FetchedData>({});
  const [openQtList, setOpenQtList] = useState<boolean>(false);
  const [openNewQuote, setOpenNewQuote] = useState<boolean>(false);
  const [itemId, setItemId] = useState<number>(0);
  const [itemInfo, setItemInfo] = useState<FetchedData>({});

  const datetime = projectDetails.datetime;
  const date = new Date(datetime!).toDateString().slice(4);
  const time = new Date(datetime!).toTimeString().slice(0, 5);

  // function
  const handleShowQuotation = (item_id: number) => {
    if (userCtx?.claims.role == "CUSTOMER") {
      setOpenQtList(true);
      setItemId(item_id);
    }
  };

  const handleCreateNewQuote = (item: FetchedData) => {
    setOpenNewQuote(true);
    setItemInfo(item);
  };

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

  const getProjectDetailsSupplier = async () => {
    const res: data = await fetchData(
      "/api/projects-items/supplier/" + params.projectId,
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

  const deleteProject = async () => {
    const res: data = await fetchData(
      "/api/projects-items/" + params.projectId,
      "DELETE",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      getProjectDetails();
      navigate(appPaths.project);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    userCtx?.claims.role == "CUSTOMER" && getProjectDetails();
    userCtx?.claims.role == "SUPPLIER" && getProjectDetailsSupplier();
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
                  <TableRow
                    hover={userCtx?.claims.role == "CUSTOMER"}
                    key={idx}
                    className={
                      userCtx?.claims.role == "CUSTOMER" ? "pointer" : ""
                    }
                    onClick={() => handleShowQuotation(row.item_id!)}
                  >
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
                        <Button
                          variant="contained"
                          onClick={() => handleCreateNewQuote(row)}
                        >
                          Quote
                        </Button>
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
              <Button variant="outlined" color="error" onClick={deleteProject}>
                Delete Project
              </Button>
            </Stack>
          )}
        </Box>
      </Box>

      <QuotationList
        openQtList={openQtList}
        setOpenQtList={setOpenQtList}
        itemId={itemId}
      ></QuotationList>

      <CreateQuotationModal
        openNewQuote={openNewQuote}
        setOpenNewQuote={setOpenNewQuote}
        itemInfo={itemInfo}
        projectId={params.projectId}
      ></CreateQuotationModal>
    </>
  );
};

export default ProjectDetail;
