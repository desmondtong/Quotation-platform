import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { navBarType } from "../interfaces";

import LogoutIcon from "@mui/icons-material/Logout";
import { appPaths } from "../appPath";
import UserContext from "../context/user";

const drawerWidth = 280;

// const StyledBadge = styled(Badge)<BadgeProps>(() => ({
//   "& .MuiBadge-badge": {
//     right: 28,
//     top: 20,
//     padding: "0 4px",
//   },
// }));

const NavBar: React.FC = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const navBar: navBarType[] = [
    {
      item: userCtx?.claims.role == "CUSTOMER" ? "My Projects" : "Projects",
      link: appPaths.project,
    },
    {
      item: userCtx?.claims.role == "CUSTOMER" ? "Quotations" : "My Quotations",
      link: appPaths.quotation,
    },
  ];

  // function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("claims");

    userCtx?.setAccessToken("");
    userCtx?.setClaims({});

    navigate(appPaths.login);
  };
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
      className="nav-bar"
    >
      <Grid component="main" bgcolor="var(--darkblue)">
        <Typography m="2rem" variant="h4" color="var(--white)">
          Platform Name
        </Typography>
      </Grid>

      <List sx={{ flexGrow: 1, bgcolor: "var(--darkblue)" }}>
        {navBar.map((item, idx) => (
          <NavLink to={item.link} style={{ textDecoration: "none" }} key={idx}>
            <ListItem>
              <ListItemButton
                sx={{
                  borderRadius: "0.5rem",
                }}
              >
                {/* <StyledBadge
                  badgeContent={
                    item.item === "Alert" ? userCtx.orderInfo?.length : 0
                  }
                  color="warning"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                > */}
                {/* <ListItemIcon sx={{ color: "var(--darkblue)" }}>
                  {item.icon}
                </ListItemIcon> */}
                {/* </StyledBadge> */}
                <ListItemText
                  primary={item.item}
                  sx={{ color: "var(--white)" }}
                />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>

      <List sx={{ bgcolor: "var(--darkblue)" }}>
        <ListItem key={"Logout"} onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "var(--white)" }} />
            </ListItemIcon>
            <ListItemText
              primary={"Logout"}
              sx={{ color: "var(--white)" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavBar;
