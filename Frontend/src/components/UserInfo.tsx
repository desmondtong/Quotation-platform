import { Typography } from "@mui/material";
import React, { useContext } from "react";
import UserContext from "../context/user";

const UserInfo: React.FC = () => {
  const userCtx = useContext(UserContext);
  return (
    <>
      <Typography
        variant="h5"
        mt="1rem"
      >{`Welcome back, ${userCtx?.claims.name}!`}</Typography>
      <Typography variant="body2" fontWeight="light" mb="1rem">
        {userCtx?.claims.company}
      </Typography>
    </>
  );
};

export default UserInfo;
