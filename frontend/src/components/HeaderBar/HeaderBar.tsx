import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const usePageTitle = () => {
  const location = useLocation();
  const { pathname } = location;

  const pathToLabelMapping = {
    "/games": "Games",
    "/scripts": "Scripts",
    "/roles": "Roles",
    "/charts": "Charts",
  };

  const currentPath = Object.keys(pathToLabelMapping).find((path) =>
    pathname.startsWith(path)
  );

  return currentPath ? pathToLabelMapping[currentPath] : "BotC Tracker";
};

const HeaderBar: React.FC = () => {
  const pageTitle = usePageTitle();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 99, borderBottom: "1px solid rgba(255,255,255,0.2)" }}
    >
      <Toolbar disableGutters>
        <Box
          sx={{ display: { xs: "none", md: "block", width: "100%" } }}
          aria-label="Title Styler"
        >
          <Typography
            variant="h4"
            noWrap
            aria-label="Page Title"
            align="center"
          >
            {pageTitle}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
