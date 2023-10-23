import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../appPath";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { FetchedData, Props, data } from "../interfaces";

const QuotationList: React.FC<Props> = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [quotationList, setQuotationList] = useState<FetchedData[]>([]);

  // endpoint
  const getQuotationByItemId = async () => {
    const res: data = await fetchData(
      "/api/quotations-items/item_id",
      "POST",
      {
        item_id: props.itemId,
      },
      userCtx?.accessToken
    );

    if (res.ok) {
      setQuotationList(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    userCtx?.claims.role == "CUSTOMER" && getQuotationByItemId();
  }, [props.itemId]);
  return (
    <>
      <Dialog
        open={props.openQtList!}
        onClose={() => props.setOpenQtList?.(false)}
        scroll="body"
      >
        <DialogTitle sx={{ m: "1rem" }} variant="h5">
          Available Quotations for Item #{props.itemId}
        </DialogTitle>
        <DialogContent sx={{ m: "1rem" }}>
          {quotationList.length ? (
            <>
              {quotationList.map((item, idx) => (
                <Stack
                  direction="row"
                  key={idx}
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={3}
                  mb="1rem"
                >
                  <Typography color="var(--darkblue)">
                    #{item.quotation_id}
                  </Typography>
                  <Typography fontWeight="light">{item.company}</Typography>
                  <Typography fontWeight="light">
                    Total Price: ${item.price}
                  </Typography>
                  <Typography
                    color={
                      item.status === "ACCEPTED" || item.status === "COMPLETED"
                        ? "var(--green)"
                        : item.status === "DECLINED"
                        ? "var(--red)"
                        : "var(--yellow)"
                    }
                  >
                    {item.status}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigate(appPaths.quotation + "/" + item.quotation_id)
                    }
                  >
                    View
                  </Button>
                </Stack>
              ))}
            </>
          ) : (
            <Typography textAlign="center" fontWeight="light" mt="2rem">
              No offer at the moment
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuotationList;
