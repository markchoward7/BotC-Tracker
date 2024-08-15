import React from "react";
import { Box, Drawer, List } from "@mui/material";
import ListItemLink from "./ListItemLink";
import DescriptionIcon from "@mui/icons-material/Description";
import CasinoIcon from "@mui/icons-material/Casino";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import SaveIcon from "@mui/icons-material/Save";
import AssessmentIcon from "@mui/icons-material/Assessment";

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      open
      PaperProps={{
        sx: {
          position: "relative",
          whiteSpace: "nowrap",
          width: 150,
          overflowX: "hidden",
        },
      }}
      ModalProps={{ BackdropProps: { "aria-label": "backdrop" } }}
    >
      <Box
        aria-label="appbar spacer"
        sx={(theme) => ({
          ...theme.mixins.toolbar,
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
        })}
      >
        <List>
          <ListItemLink to="/games" primary="Games" icon={<CasinoIcon />} />
          <ListItemLink
            to="/scripts"
            primary="Scripts"
            icon={<DescriptionIcon />}
          />
          <ListItemLink to="/roles" primary="Roles" icon={<StopCircleIcon />} />
          <ListItemLink
            to="/charts"
            primary="Charts"
            icon={<AssessmentIcon />}
          />
          <ListItemLink to="/data" primary="Data" icon={<SaveIcon />} />
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
