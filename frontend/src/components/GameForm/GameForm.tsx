import React from "react";
import { useAPIContext } from "context";
import { useNavigate, useParams } from "react-router-dom";
import useGameFormReducer from "./GameFormReducer";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Game, Role } from "types";
import { createGame, updateGame, updateGameRoles } from "api";

const GameForm: React.FC = () => {
  const { games, scripts, roles, refresh } = useAPIContext();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game =
    gameId === "new" ? undefined : games.find((g) => g.id === Number(gameId));

  const {
    state,
    setDate,
    setRoles,
    setScript,
    setWinningTeam,
    setInPerson,
    setNotes,
    setPlayerCount,
    setDrunkRole,
  } = useGameFormReducer(game);
  const {
    date,
    roles: gameRoles,
    scriptId,
    winningTeam,
    isInPerson,
    notes,
    playerCount,
    drunkSawRoleId,
  } = state;

  const handleDate = (value: Dayjs) => {
    setDate(value.toDate());
  };
  const handleWinningteam = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== "EVIL" && value !== "GOOD") {
      return;
    }
    setWinningTeam(value);
  };
  const handleScript = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScript(Number(event.target.value));
  };
  const handlePlayerCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerCount(Number(event.target.value));
  };
  const handleIsInPerson = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInPerson(event.target.checked);
  };
  const handleRoles = (
    event: React.SyntheticEvent<Element, Event>,
    value: Role[]
  ) => {
    setRoles(value);
  };
  const handleDrunkRole = (event: SelectChangeEvent<number>) => {
    setDrunkRole(Number(event.target.value) || null);
  };
  const handleNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const orderRoles = (role1: Role, role2: Role): number => {
    const script = scripts.find((s) => s.id === scriptId);
    if (script) {
      const scriptRoleIds = script.roles.map((role) => role.id);
      if (
        scriptRoleIds.includes(role1.id) &&
        !scriptRoleIds.includes(role2.id)
      ) {
        return -1;
      }
      if (
        !scriptRoleIds.includes(role1.id) &&
        scriptRoleIds.includes(role2.id)
      ) {
        return 1;
      }
    }
    if (role1.name > role2.name) {
      return 1;
    }
    if (role2.name > role1.name) {
      return -1;
    }
    return 0;
  };

  const groupRoles = (role: Role): string => {
    const script = scripts.find((s) => s.id === scriptId);
    if (script) {
      const scriptRoleIds = script.roles.map((role) => role.id);
      if (scriptRoleIds.includes(role.id)) {
        return "On Script";
      }
    }
    return "Not On Script";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data: Game = {
      date,
      isInPerson,
      notes,
      playerCount,
      scriptId,
      winningTeam,
      drunkSawRoleId,
    };
    const finalRoles = gameRoles.map((role) => ({ name: role.name }));
    if (game) {
      updateGame(data, game.id).then(() =>
        updateGameRoles(finalRoles, game.id).then(() => {
          navigate("/games");
          refresh();
        })
      );
    } else {
      createGame(data).then((newGame) =>
        updateGameRoles(finalRoles, newGame.id).then(() => {
          navigate("/games");
          refresh();
        })
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
          <Typography variant="h3">Game {gameId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControlLabel
              label="Date"
              control={<DatePicker value={dayjs(date)} onChange={handleDate} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <FormLabel>Winning Team</FormLabel>
            <RadioGroup value={winningTeam} onChange={handleWinningteam}>
              <FormControlLabel value="EVIL" control={<Radio />} label="EVIL" />
              <FormControlLabel value="GOOD" control={<Radio />} label="GOOD" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <InputLabel>Script</InputLabel>
            <Select
              value={scriptId}
              label="Script"
              onChange={handleScript}
              sx={{ minWidth: 200 }}
            >
              {scripts.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            value={playerCount}
            onChange={handlePlayerCount}
            label="Player Count"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label="In Person?"
            control={
              <Checkbox checked={isInPerson} onChange={handleIsInPerson} />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={roles.sort(orderRoles)}
            groupBy={groupRoles}
            value={gameRoles}
            getOptionLabel={(option) => option.name}
            onChange={handleRoles}
            isOptionEqualToValue={() => false}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Roles" />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Drunk</InputLabel>
            <Select value={drunkSawRoleId} onChange={handleDrunkRole}>
              <MenuItem value={null} />
              {roles
                .toSorted(orderRoles)
                .filter((role) => role.team === "TOWNSFOLK")
                .map((role) => (
                  <MenuItem value={role.id}>{role.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            value={notes}
            onChange={handleNotes}
            label="Notes"
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <Button type="submit">Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default GameForm;
