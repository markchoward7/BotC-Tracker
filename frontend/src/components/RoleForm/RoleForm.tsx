import { useAPIContext } from "context";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useRoleFormReducer from "./RoleFormReducer";
import { Role } from "types";
import { createRole, updateRole } from "api";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const RoleForm: React.FC = () => {
  const { roles, refresh } = useAPIContext();
  const { roleId } = useParams();
  const navigate = useNavigate();

  const role =
    roleId === "new" ? undefined : roles.find((r) => r.id === Number(roleId));

  const { state, setName, setTeam } = useRoleFormReducer();
  const { name, team } = state;

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleTeam = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (
      value === "TOWNSFOLK" ||
      value === "OUTSIDER" ||
      value === "MINION" ||
      value === "DEMON"
    ) {
      setTeam(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data: Role = {
      name,
      team,
    };
    if (role) {
      updateRole(data, role.id).then(() => {
        navigate("/roles");
        refresh();
      });
    } else {
      createRole(data).then(() => {
        navigate("/roles");
        refresh();
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        spacing={4}
        sx={{ alignContent: "center", width: "80%", margin: 5 }}
      >
        <Grid item xs={12}>
          <Typography variant="h3">Role {roleId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField value={name} onChange={handleName} label="Name" />
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              value={team}
              label="Type"
              onChange={handleTeam}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="TOWNSFOLK">Townsfolk</MenuItem>
              <MenuItem value="OUTSIDER">Outsider</MenuItem>
              <MenuItem value="MINION">Minion</MenuItem>
              <MenuItem value="DEMON">Demon</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Button type="submit">Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RoleForm;
