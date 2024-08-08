import React, { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export type ListItemLinkProps = {
  icon: ReactNode;
  primary: string;
  to: string;
};

const ListItemLink: React.FC<ListItemLinkProps> = ({ icon, primary, to }) => {
  return (
    <li>
      <ListItemButton component={RouterLink} to={to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItemButton>
    </li>
  );
};

export default ListItemLink;
