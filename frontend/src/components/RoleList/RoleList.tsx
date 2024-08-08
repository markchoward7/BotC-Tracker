import { Button } from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRowParams,
  MuiEvent,
} from "@mui/x-data-grid";
import { useAPIContext } from "context";
import React from "react";
import { useNavigate } from "react-router-dom";

const RoleList: React.FC = () => {
  const { roles } = useAPIContext();
  const navigate = useNavigate();

  const handleRowSelection = (
    params: GridRowParams,
    event: MuiEvent,
    details: GridCallbackDetails
  ) => {
    navigate(`/roles/${params.row.id}`);
  };

  const columns: GridColDef<(typeof roles)[number]>[] = [
    { field: "id", headerName: "ID", width: 50, align: "right" },
    { field: "name", headerName: "Name", width: 200 },
    { field: "team", headerName: "Type", width: 200 },
  ];

  if (roles.length === 0) {
    return null;
  }
  return (
    <>
      <Button onClick={() => navigate("/roles/new")}>Add New</Button>
      <DataGrid
        rows={roles}
        columns={columns}
        onRowClick={handleRowSelection}
      />
    </>
  );
};

export default RoleList;
