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

const ScriptList: React.FC = () => {
  const { scripts } = useAPIContext();
  const navigate = useNavigate();

  const handleRowSelection = (
    params: GridRowParams,
    event: MuiEvent,
    details: GridCallbackDetails
  ) => {
    navigate(`/scripts/${params.row.id}`);
  };

  const columns: GridColDef<(typeof scripts)[number]>[] = [
    { field: "id", headerName: "ID", width: 50, align: "right" },
    { field: "name", headerName: "Name", width: 300 },
  ];

  if (scripts.length === 0) {
    return null;
  }
  return (
    <>
      <Button onClick={() => navigate("/scripts/new")}>Add New</Button>
      <DataGrid
        rows={scripts}
        columns={columns}
        onRowClick={handleRowSelection}
      />
    </>
  );
};

export default ScriptList;
