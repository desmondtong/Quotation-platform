import React from "react";
import {
  FormControl,
  InputLabel,
  //   Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { Props } from "../interfaces";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const SearchBar: React.FC<Props> = () => {
  return (
    <>
      <FormControl
        variant="outlined"
        // onChange={props.handleSearch}
        sx={{
          boxShadow: 3,
          borderRadius: "2rem",
          bgcolor: "var(--lightgrey)",
          width:"50%"
        }}
        size="small"
        className="search-bar"
      >
        <InputLabel htmlFor="outlined-adornment" sx={{ ml: "0.5rem" }}>
          {/* <Typography>{props.children}</Typography> */}
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment"
          type="text"
          endAdornment={
            <InputAdornment position="end">
              <IconButton edge="end" disabled sx={{ mr: "0.1rem" }}>
                <SearchOutlinedIcon className="icon-orange" />
              </IconButton>
            </InputAdornment>
          }
          //   label={props.children}
          sx={{ borderRadius: "2rem" }}
        />
      </FormControl>
    </>
  );
};

export default SearchBar;
