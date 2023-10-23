import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { FetchedData, Props, data } from "../interfaces";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../appPath";

const CreationModal: React.FC<Props> = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  // endpoint
  const createProject = async () => {
    const res: data = await fetchData(
      "/api/projects-items",
      "PUT",
      {
        item_id: props.itemId,
      },
      userCtx?.accessToken
    );

    if (res.ok) {
      // prop and refresh project at page
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    userCtx?.claims.role == "CUSTOMER" && createProject();
  }, []);
  return (
    <>
      <Dialog
        open={props.openCreateModal!}
        onClose={() => props.setOpenCreateModal?.(false)}
        scroll="body"
      >
        <DialogTitle sx={{ p: 0 }} className="pic-display">
            New Project
        </DialogTitle>
        <DialogContent sx={{ m: "1rem" }}>
          <DialogContentText
            my="1rem"
            variant="h5"
            color="var(--darkgrey-text)"
          >
            New Project
            
            <TextField
              autoFocus
              required
              margin="normal"
              id="description"
              label="Description"
              multiline
              rows={2}
              type="text"
              fullWidth
            //   inputRef={descriptionRef}
            />

          </DialogContentText>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default CreationModal;
