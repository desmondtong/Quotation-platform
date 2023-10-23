import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import useFetch from "../hooks/useFetch";
import { FetchedData, Props, data } from "../interfaces";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../appPath";

const CreationModal: React.FC<Props> = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [technologies, setTechnologies] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [surfaceFinishes, setSurfaceFinishes] = useState<string[]>([]);

  const projectNameRef = useRef<HTMLInputElement>();
  const technologyRef = useRef<HTMLInputElement>();
  const materialRef = useRef<HTMLInputElement>();
  const surfaceFinishRef = useRef<HTMLInputElement>();

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

  const getTechnologies = async () => {
    const res: data = await fetchData(
      "/api/constraints/technologies",
      "GET",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      setTechnologies(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  const getMaterials = async () => {
    const res: data = await fetchData(
      "/api/constraints/materials",
      "GET",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      setMaterials(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  const getSurfaceFinishes = async () => {
    const res: data = await fetchData(
      "/api/constraints/surface-finishes",
      "GET",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      setSurfaceFinishes(res.data.msg);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    // new project
    userCtx?.claims.role == "CUSTOMER" && createProject();

    getTechnologies();
    getMaterials();
    getSurfaceFinishes();
  }, []);
  return (
    <>
      <Dialog
        open={props.openCreateModal!}
        onClose={() => props.setOpenCreateModal?.(false)}
        scroll="body"
      >
        <DialogTitle sx={{ m: "1rem" }} variant="h5">
          New Project
        </DialogTitle>

        <DialogContent sx={{ m: "1rem" }}>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            label="Project Name"
            multiline
            rows={2}
            type="text"
            fullWidth
            inputRef={projectNameRef}
          />

          {/* item details */}
          <TextField
            select
            required
            margin="normal"
            id="technology"
            label="Tecnology"
            type="text"
            fullWidth
            defaultValue=""
            inputRef={technologyRef}
          >
            {technologies.map((item, idx) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            required
            margin="normal"
            id="material"
            label="Material"
            type="text"
            fullWidth
            defaultValue=""
            inputRef={materialRef}
          >
            {materials.map((item, idx) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            required
            margin="normal"
            id="surfaceFinish"
            label="Surface Finish"
            type="text"
            fullWidth
            defaultValue=""
            inputRef={surfaceFinishRef}
          >
            {surfaceFinishes.map((item, idx) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default CreationModal;
