import React from "react";
import { UserContextType } from "../interfaces";

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export default UserContext;
