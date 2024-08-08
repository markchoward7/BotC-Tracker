import React from "react";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRowParams,
  MuiEvent,
} from "@mui/x-data-grid";
import { useAPIContext } from "context";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const GameList: React.FC = () => {
  const { games, scripts } = useAPIContext();
  const navigate = useNavigate();

  const handleRowSelection = (
    params: GridRowParams,
    event: MuiEvent,
    details: GridCallbackDetails
  ) => {
    navigate(`/games/${params.row.id}`);
  };

  const columns: GridColDef<(typeof games)[number]>[] = [
    { field: "id", headerName: "ID", width: 50, align: "right" },
    { field: "date", headerName: "Date", width: 120 },
    { field: "playerCount", headerName: "Players", width: 100 },
    { field: "winningTeam", headerName: "Winning Team", width: 120 },
    {
      field: "scriptId",
      headerName: "Script",
      width: 300,
      valueGetter: (value, row) => {
        const script = scripts.find((script) => script.id == value);
        return script ? script.name : "";
      },
    },
    { field: "notes", headerName: "Notes", width: 500 },
  ];

  if (games.length === 0) {
    return null;
  }
  return (
    <>
      <Button onClick={() => navigate("/games/new")}>Add New</Button>
      <DataGrid
        rows={games}
        columns={columns}
        initialState={{
          sorting: { sortModel: [{ field: "date", sort: "desc" }] },
        }}
        onRowClick={handleRowSelection}
      />
    </>
  );
};

export default GameList;
