import { Button, TextField } from "@mui/material";
import {
  bulkCreateGames,
  bulkCreateGamesRoles,
  bulkCreateRoles,
  bulkCreateScripts,
  bulkCreateScriptsRoles,
} from "api";
import { useAPIContext } from "context";
import React, { useState } from "react";
import { Game, Role, Script } from "types";

const DataRecovery: React.FC = () => {
  const { games, roles, scripts } = useAPIContext();
  const [file, setFile] = useState<File>();

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { files } = event.target;
    setFile(files?.[0]);
  };

  const handleDump = () => {
    const json = JSON.stringify({ games, roles, scripts });
    const blob = new Blob([json], { type: "text/json" });
    const anchor = document.createElement("a");
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = "botc-dump-" + new Date().toISOString() + ".json";
    anchor.dataset.downloadurl = [
      "text/json",
      anchor.download,
      anchor.href,
    ].join(":");
    anchor.click();
    anchor.remove();
  };

  const handleLoad = () => {
    file.text().then((fileData) => {
      const data = JSON.parse(fileData) as {
        games: Game[];
        roles: Role[];
        scripts: Script[];
      };
      Promise.all([
        bulkCreateRoles(data.roles),
        bulkCreateScripts(
          data.scripts.map((script) => ({ id: script.id, name: script.name }))
        ),
      ]).then(([roles, scripts]) => {
        const scriptsRoles = data.scripts.flatMap((script) =>
          script.roles.map((role) => ({ scriptId: script.id, roleId: role.id }))
        );
        bulkCreateScriptsRoles(scriptsRoles);
        bulkCreateGames(
          data.games.map((game) => ({
            id: game.id,
            date: game.date,
            isInPerson: game.isInPerson,
            notes: game.notes,
            playerCount: game.playerCount,
            scriptId: game.scriptId,
            winningTeam: game.winningTeam,
          }))
        ).then(() => {
          const gamesRoles = data.games.flatMap((game) =>
            game.roles.map((role) => ({ gameId: game.id, roleId: role.id }))
          );
          bulkCreateGamesRoles(gamesRoles);
        });
      });
    });
  };

  return (
    <>
      <Button onClick={handleDump}>Dump</Button>
      <TextField type="file" onChange={handleFileSelect} />
      <Button onClick={handleLoad}>Load</Button>
    </>
  );
};

export default DataRecovery;
