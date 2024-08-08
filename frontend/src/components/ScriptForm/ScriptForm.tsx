import { useAPIContext } from "context";
import React from "react";
import { useParams } from "react-router-dom";
import useScriptFormReducer from "./ScriptFormReducer";
import { Role, Script } from "types";
import { createScript, updateScript, updateScriptRoles } from "api";
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const ScriptForm: React.FC = () => {
  const { scripts, roles } = useAPIContext();
  const { scriptId } = useParams();
  const script =
    scriptId === "new"
      ? undefined
      : scripts.find((s) => s.id === Number(scriptId));

  const { state, setName, setRoles } = useScriptFormReducer(script);
  const { roles: scriptRoles, name } = state;

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleRoles = (
    event: React.SyntheticEvent<Element, Event>,
    value: Role[]
  ) => {
    setRoles(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data: Script = {
      name,
    };
    const finalRoles = scriptRoles.map((role) => ({ name: role.name }));
    if (script) {
      updateScript(data, script.id).then(() =>
        updateScriptRoles(finalRoles, script.id)
      );
    } else {
      createScript(data).then((newScript) =>
        updateScriptRoles(finalRoles, newScript.id)
      );
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
          <Typography variant="h3">Script {scriptId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField value={name} onChange={handleName} label="Name" />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={roles}
            value={scriptRoles}
            getOptionLabel={(option) => option.name}
            onChange={handleRoles}
            isOptionEqualToValue={(x, y) => x.id === y.id}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Roles" />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Button type="submit">Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ScriptForm;
