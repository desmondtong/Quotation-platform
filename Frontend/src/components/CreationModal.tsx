import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { FetchedData, Props, data } from "../interfaces";

const CreationModal: React.FC<Props> = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [technologies, setTechnologies] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [surfaceFinishes, setSurfaceFinishes] = useState<string[]>([]);

  const defaultItems: FetchedData[] = [
    {
      item_name: "",
      technology: "3D Printing",
      material: "Aluminum 6061",
      surface_finish: "Anodizing Type II",
      c_technology: "",
      c_material: "",
      c_surface_finish: "",
      quantity: 0,
    },
  ];
  const [projectItems, setProjectItems] = useState<FetchedData[]>(defaultItems);

  const projectNameRef = useRef<HTMLInputElement>();

  // function
  const handleCreateProject = () => {
    // filter out c_*
    // use value from c_* if user select Custom
    const items = projectItems.map((item) => ({
      technology: item.technology?.includes("Custom")
        ? item.c_technology
        : item.technology,
      material: item.material?.includes("Custom")
        ? item.c_material
        : item.material,
      surface_finish: item.surface_finish?.includes("Custom")
        ? item.c_surface_finish
        : item.surface_finish,
      quantity: item.quantity,
      item_name: item.item_name,
    }));

    const projectItemBody = {
      customer_id: userCtx?.claims.user_id,
      project_name: projectNameRef.current?.value,
      items,
    };

    createProject(projectItemBody);
  };

  const handleCancel = () => {
    props.setOpenCreateModal?.(false);
    setProjectItems(defaultItems);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedItems = [...projectItems];
    (updatedItems[index] as any)[field] = value;
    setProjectItems(updatedItems);
  };

  const handleAddProjectItem = () => {
    setProjectItems([...projectItems, defaultItems[0]]);
  };

  const handleRemoveProjectItem = (index: number) => {
    const updatedItems = [...projectItems];
    updatedItems.splice(index, 1);
    setProjectItems(updatedItems);
  };

  // endpoint
  const createProject = async (body: FetchedData) => {
    const res: data = await fetchData(
      "/api/projects-items",
      "PUT",
      body,
      userCtx?.accessToken
    );

    if (res.ok) {
      props.setOpenCreateModal?.(false);
      props.getAllCustomerProjects?.();
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
        open={props.openCreateModal!}
        onClose={() => props.setOpenCreateModal?.(false)}
        scroll="body"
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ m: "1rem" }} variant="h5">
          New Project
        </DialogTitle>
        {JSON.stringify(projectItems)}
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
          <Button
            variant="contained"
            sx={{ mt: "1rem" }}
            onClick={handleAddProjectItem}
            disabled={projectItems.length == 5}
          >
            Add more item
          </Button>

          {/* item details */}
          {projectItems.map((item, index) => (
            <Stack direction="row" spacing={2} key={index} mt="2rem">
              <TextField
                autoFocus
                required
                margin="normal"
                label="Item Name"
                type="text"
                fullWidth
                onChange={(e) =>
                  handleInputChange(index, "item_name", e.target.value)
                }
              />

              <TextField
                select
                required
                margin="normal"
                label={`Technology-${index}`}
                type="text"
                fullWidth
                defaultValue={technologies[0]}
                onChange={(e) =>
                  handleInputChange(index, "technology", e.target.value)
                }
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
                disabled={item.technology != "Custom Technology"}
                margin="normal"
                id="name"
                label="Custom Technology"
                type="text"
                fullWidth
                onChange={(e) =>
                  handleInputChange(index, "c_technology", e.target.value)
                }
              />

              <TextField
                select
                required
                margin="normal"
                id="material"
                label={`Material-${index}`}
                type="text"
                fullWidth
                defaultValue={materials[0]}
                onChange={(e) =>
                  handleInputChange(index, "material", e.target.value)
                }
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
                disabled={item.material != "Custom Material"}
                margin="normal"
                id="name"
                label="Custom Material"
                type="text"
                fullWidth
                onChange={(e) =>
                  handleInputChange(index, "c_material", e.target.value)
                }
              />

              <TextField
                select
                required
                margin="normal"
                id="surfaceFinish"
                label={`Surface Finish-${index}`}
                type="text"
                fullWidth
                defaultValue={surfaceFinishes[0]}
                onChange={(e) =>
                  handleInputChange(index, "surface_finish", e.target.value)
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
                disabled={item.surface_finish != "Custom Finish"}
                margin="normal"
                id="name"
                label="Custom Surface Finish"
                type="text"
                fullWidth
                onChange={(e) =>
                  handleInputChange(index, "c_surface_finish", e.target.value)
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
                onChange={(e) =>
                  handleInputChange(index, "quantity", e.target.value)
                }
              />

              <Button
                size="small"
                color="error"
                sx={{ borderRadius: "2rem" }}
                disabled={index == 0}
                onClick={() => handleRemoveProjectItem(index)}
              >
                -
              </Button>
            </Stack>
          ))}
        </DialogContent>

        <DialogActions sx={{ mx: "1rem", mb: "1rem" }}>
          <Button variant="contained" onClick={handleCreateProject}>
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

export default CreationModal;
