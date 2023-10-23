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
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { FetchedData, Props, data } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../appPath";

const CreateQuotationModal: React.FC<Props> = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [technologies, setTechnologies] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [surfaceFinishes, setSurfaceFinishes] = useState<string[]>([]);

  const defaultItems: FetchedData = {
    item_name: "",
    technology: "3D Printing",
    material: "Aluminum 6061",
    surface_finish: "Anodizing Type II",
    c_technology: "",
    c_material: "",
    c_surface_finish: "",
    quantity: 0,
  };
  const [quoteItems, setQuoteItems] = useState<FetchedData>(defaultItems);

  // function
  const handleCreateQuotation = () => {
    console.log(quoteItems);
  };

  const handleCancel = () => {
    props.setOpenNewQuote?.(false);
    setQuoteItems(defaultItems);
  };

  const handleInputChange = (field: string, value: any) => {
    const updatedItems = { ...quoteItems };
    (updatedItems as any)[field] = value;
    setQuoteItems(updatedItems);
  };

  // endpoint
  const createQuotation = async () => {};

  const getTechnologies = async () => {
    const res: data = await fetchData(
      "/api/constraints/technologies",
      "GET",
      undefined,
      userCtx?.accessToken
    );

    if (res.ok) {
      setTechnologies(res.data);
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
      setMaterials(res.data);
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
      setSurfaceFinishes(res.data);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    getTechnologies();
    getMaterials();
    getSurfaceFinishes();
  }, []);
  return (
    <>
      <Dialog
        open={props.openNewQuote!}
        onClose={() => props.setOpenNewQuote?.(false)}
        scroll="body"
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ m: "1rem" }} variant="h5">
          New Quotation
        </DialogTitle>

        <DialogContent sx={{ m: "1rem" }}>
          <DialogContentText variant="h6" color="var(--darkblue)">
            Customer's Requirement
          </DialogContentText>
          <Stack direction="row" spacing={2} mb="2rem" mt="1rem">
            <TextField
              inputProps={{ readOnly: true }}
              disabled
              margin="normal"
              label="Item Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={props.itemInfo?.item_name}
            />
            <TextField
              inputProps={{ readOnly: true }}
              disabled
              margin="normal"
              label="Technology"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={props.itemInfo?.technology}
            />
            <TextField
              inputProps={{ readOnly: true }}
              disabled
              margin="normal"
              label="Material"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={props.itemInfo?.material}
            />
            <TextField
              inputProps={{ readOnly: true }}
              disabled
              margin="normal"
              label="Surface Finish"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={props.itemInfo?.surface_finish}
            />
            <TextField
              inputProps={{ readOnly: true }}
              disabled
              margin="normal"
              label="Quantity"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.itemInfo?.quantity}
            />
          </Stack>

          <DialogContentText variant="h6" color="var(--darkblue)">
            Your Quote
          </DialogContentText>
          <Stack direction="row" spacing={2} mb="2rem" mt="1rem">
            <TextField
              autoFocus
              required
              margin="normal"
              label="Item Name"
              type="text"
              fullWidth
              onChange={(e) => handleInputChange("item_name", e.target.value)}
            />

            <TextField
              select
              required
              margin="normal"
              label="Technology"
              type="text"
              fullWidth
              defaultValue={technologies[0]}
              onChange={(e) => handleInputChange("technology", e.target.value)}
            >
              {technologies.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              autoFocus
              required
              disabled={quoteItems.technology != "Custom Technology"}
              margin="normal"
              id="name"
              label="Custom Technology"
              type="text"
              fullWidth
              onChange={(e) =>
                handleInputChange("c_technology", e.target.value)
              }
            />

            <TextField
              select
              required
              margin="normal"
              id="material"
              label="Material"
              type="text"
              fullWidth
              defaultValue={materials[0]}
              onChange={(e) => handleInputChange("material", e.target.value)}
            >
              {materials.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              autoFocus
              required
              disabled={quoteItems.material != "Custom Material"}
              margin="normal"
              id="name"
              label="Custom Material"
              type="text"
              fullWidth
              onChange={(e) => handleInputChange("c_material", e.target.value)}
            />

            <TextField
              select
              required
              margin="normal"
              id="surfaceFinish"
              label="Surface Finish"
              type="text"
              fullWidth
              defaultValue={surfaceFinishes[0]}
              onChange={(e) =>
                handleInputChange("surface_finish", e.target.value)
              }
            >
              {surfaceFinishes.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              autoFocus
              required
              disabled={quoteItems.surface_finish != "Custom Finish"}
              margin="normal"
              id="name"
              label="Custom Surface Finish"
              type="text"
              fullWidth
              onChange={(e) =>
                handleInputChange("c_surface_finish", e.target.value)
              }
            />

            <TextField
              autoFocus
              required
              margin="normal"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              onChange={(e) => handleInputChange("quantity", e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ mx: "1rem", mb: "1rem" }}>
          <Button variant="contained" onClick={handleCreateQuotation}>
            Create
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateQuotationModal;
