import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
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
import UserContext from "../context/user";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { FetchedData, data } from "../interfaces";
import { appPaths } from "../appPath";

const QuotationDetail: React.FC = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();

  const [quotationDetails, setQuotationDetails] = useState<FetchedData>({});

  const datetime = quotationDetails.qt_datetime;
  const date = new Date(datetime!).toDateString().slice(4);
  const time = new Date(datetime!).toTimeString().slice(0, 5);

  // endpoint
  const getQuotationDetails = async () => {
    const res: data = await fetchData(
      "/api/quotations-items/quotation_id",
      "POST",
      {
        quotation_id: params.quotationId,
      },
      userCtx?.accessToken
    );

    if (res.ok) {
      setQuotationDetails(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    getQuotationDetails();
  }, []);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <NavBar></NavBar>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          {/* Quotation details */}
          <Stack direction="column" mb="1.5rem">
            <Typography variant="h4" gutterBottom>
              Quotation Details
            </Typography>
            <Stack direction="row" spacing={1}>
              <Typography>Quotation ID:</Typography>
              <Typography fontWeight="light">#{params.quotationId}</Typography>
            </Stack>

            {userCtx?.claims.role == "CUSTOMER" && (
              <>
                <Stack direction="row" spacing={1}>
                  <Typography>Supplier Company:</Typography>
                  <Typography fontWeight="light">
                    {quotationDetails.supplier_company}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography>Email:</Typography>
                  <Typography fontWeight="light">
                    {quotationDetails.supplier_email}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography>Phone Number:</Typography>
                  <Typography fontWeight="light">
                    {quotationDetails.supplier_phone_number}
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
                  quotationDetails.qt_status === "ACCEPTED" ||
                  quotationDetails.qt_status === "COMPLETED"
                    ? "var(--green)"
                    : quotationDetails.qt_status === "DECLINED"
                    ? "var(--red)"
                    : "var(--yellow)"
                }
              >
                {quotationDetails.qt_status}
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="h5" color="var(--darkblue)">
            {userCtx?.claims.role == "CUSTOMER" ? "Quoted By Supplier" : "Quoted By You"}
          </Typography>
          {/* Quoted item list */}
          <TableContainer component={Paper} elevation={0} sx={{ my: "1.5rem" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography>Quotation ID</Typography>
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
                    <Typography variant="body1">Unit Price</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Total Price</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="var(--darkblue)"
                    >
                      #{quotationDetails.qt_items?.quotation_id}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.qt_item_name}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.qt_technology}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.qt_material}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.qt_surface_finish}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.qt_quantity}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.qt_unit_price}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.qt_price}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" color="var(--darkblue)">
          {userCtx?.claims.role == "CUSTOMER" ? "Your Item" : "Customer's Item"}
          </Typography>
          {/* Item list */}
          <TableContainer component={Paper} elevation={0} sx={{ my: "1.5rem" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography>Project ID</Typography>
                  </TableCell>
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
                    <Typography variant="body1">Status</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      appPaths.project +
                        "/" +
                        quotationDetails.qt_items?.project_id
                    )
                  }
                >
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="var(--darkblue)"
                    >
                      #{quotationDetails.qt_items?.project_id}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="var(--darkblue)"
                    >
                      #{quotationDetails.qt_items?.item_id}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.item_name}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.technology}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.material}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.surface_finish}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {quotationDetails.qt_items?.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      color={
                        quotationDetails.qt_items?.status == "QUOTE ACCEPTED" ||
                        quotationDetails.qt_items?.status == "COMPLETED"
                          ? "var(--green)"
                          : quotationDetails.qt_items?.status === "OFFERED"
                          ? "var(--yellow)"
                          : "var(--lightgrey-text)"
                      }
                    >
                      {quotationDetails.qt_items?.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action buttons */}
          {userCtx?.claims.role == "CUSTOMER" && (
            <Stack direction="row" justifyContent="flex-end" mt="1rem">
              <Button
                variant="contained"
                disabled={quotationDetails.qt_status != "PENDING"}
              >
                Accept Quotation
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default QuotationDetail;
