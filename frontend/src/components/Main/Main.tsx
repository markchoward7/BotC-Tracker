import { Box, CircularProgress } from "@mui/material";
import {
  Sidebar,
  GameList,
  HeaderBar,
  GameForm,
  DataRecovery,
  ScriptForm,
  ScriptList,
  RoleForm,
  RoleList,
  ChartPage,
} from "components";
import { useAPIContext } from "context";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Main: React.FC = () => {
  const { loading } = useAPIContext();
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ display: "flex" }}>
      <HeaderBar />
      <Sidebar />
      <main
        style={{
          flexGrow: 1,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Box
          aria-label="appbar spacer"
          sx={(theme) => ({ ...theme.mixins.toolbar, mt: "2%" })}
        />
        <Routes>
          <Route path="/charts" Component={ChartPage} />
          <Route path="/games/:gameId" Component={GameForm} />
          <Route path="/games" Component={GameList} />
          <Route path="/scripts/:scriptId" Component={ScriptForm} />
          <Route path="/scripts" Component={ScriptList} />
          <Route path="/roles/:roleId" Component={RoleForm} />
          <Route path="/roles" Component={RoleList} />
          <Route path="/data" Component={DataRecovery} />
          <Route path="*" element={<Navigate to="/games" replace />} />
        </Routes>
      </main>
    </Box>
  );
};

export default Main;
