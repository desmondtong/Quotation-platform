import {
  Box,
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
import useFetch from "../hooks/useFetch";
import { FetchedData, data } from "../interfaces";
import UserContext from "../context/user";
import { appPaths } from "../appPath";
import SearchBar from "../components/SearchBar";

const Quotation: React.FC = () => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const [quotations, setQuotations] = useState<FetchedData[]>([]);

  // endpoint
  const getAllQuotationsByCustomerId = async () => {
    const res: data = await fetchData(
      "/api/quotations-items/customer_id",
      "POST",
      {
        customer_id: userCtx?.claims.user_id,
      },
      userCtx?.accessToken
    );

    if (res.ok) {
      setQuotations(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    userCtx?.claims.role == "CUSTOMER" && getAllQuotationsByCustomerId();
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
            my="1rem"
          >{`Welcome back, ${userCtx?.claims.name}!`}</Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <SearchBar></SearchBar>
          </Stack>

          <TableContainer component={Paper} elevation={0} sx={{ mt: "1.5rem" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="body1">Quotation ID</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Date</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Supplier</Typography>
                  </TableCell>
                  {userCtx?.claims.role == "CUSTOMER" && (
                    <TableCell align="center">
                      <Typography variant="body1">Quotation Status</Typography>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Typography variant="body1">Project ID</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Project Name</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {quotations.map((row, idx) => (
                  <TableRow
                    hover
                    key={idx}
                    onClick={() =>
                      navigate(appPaths.quotation + "/" + row.quotation_id)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="center">
                      <Typography variant="body2" color="var(--darkblue)">
                        #{row.quotation_id}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="light">
                        {new Date(row.qt_datetime!).toDateString().slice(4)},{" "}
                        {new Date(row.qt_datetime!).toTimeString().slice(0, 5)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.supplier_company}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        color={
                          row.qt_status === "ACCEPTED" ||
                          row.qt_status === "COMPLETED"
                            ? "var(--green)"
                            : row.qt_status === "DECLINED"
                            ? "var(--red)"
                            : "var(--yellow)"
                        }
                      >
                        {row.qt_status}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">{row.project_id}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.project_name}
                      </Typography>
                    </TableCell>
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

export default Quotation;
