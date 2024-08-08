import axios from "axios";
import { Game, Script, Role } from "types";

export const getGames = async (): Promise<Game[]> => {
  const url = "/api/games";
  const config = { headers: { Accept: "application/json" } };
  const response = await axios.get(url, config);
  return response.data.result;
};

export const getScripts = async (): Promise<Script[]> => {
  const url = "/api/scripts";
  const config = { headers: { Accept: "application/json" } };
  const response = await axios.get(url, config);
  return response.data.result;
};

export const getRoles = async (): Promise<Role[]> => {
  const url = "/api/roles";
  const config = { headers: { Accept: "application/json" } };
  const response = await axios.get(url, config);
  return response.data.result;
};

export const createGame = async (game: Game): Promise<Game> => {
  const url = "/api/games";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const data = { ...game, date: game.date.toISOString().split("T")[0] };
  const response = await axios.post(url, data, config);
  return response.data;
};

export const createScript = async (script: Script): Promise<Script> => {
  const url = "/api/scripts";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, script, config);
  return response.data;
};

export const createRole = async (role: Role): Promise<Role> => {
  const url = "/api/roles";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, role, config);
  return response.data;
};

export const updateGame = async (game: Game, id: number): Promise<Game> => {
  const url = `/api/games/${id}`;
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const data = { ...game, date: game.date.toISOString().split("T")[0] };
  const response = await axios.put(url, data, config);
  return response.data;
};

export const updateScript = async (
  script: Script,
  id: number
): Promise<Script> => {
  const url = `/api/scripts/${id}`;
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.put(url, script, config);
  return response.data;
};

export const updateRole = async (role: Role, id: number): Promise<Role> => {
  const url = `/api/roles/${id}`;
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.put(url, role, config);
  return response.data;
};

export const updateGameRoles = async (
  roles: Role[],
  gameId: number
): Promise<Game> => {
  const url = `/api/games/${gameId}/roles`;
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, roles, config);
  return response.data;
};

export const updateScriptRoles = async (
  roles: Role[],
  scriptId: number
): Promise<Script> => {
  const url = `/api/scripts/${scriptId}/roles`;
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, roles, config);
  return response.data;
};

export const bulkCreateRoles = async (roles: Role[]): Promise<Role[]> => {
  const url = "/api/roles/bulk";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, roles, config);
  return response.data;
};

export const bulkCreateScripts = async (
  scripts: Script[]
): Promise<Script[]> => {
  const url = "/api/scripts/bulk";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, scripts, config);
  return response.data;
};

export const bulkCreateGames = async (games: Game[]): Promise<Game[]> => {
  const url = "/api/games/bulk";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, games, config);
  return response.data;
};

export const bulkCreateScriptsRoles = async (
  scriptsRoles: {
    scriptId: number;
    roleId: number;
  }[]
) => {
  const url = "/api/scripts/roles/bulk";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, scriptsRoles, config);
  return response.data;
};

export const bulkCreateGamesRoles = async (
  gamesRoles: {
    gameId: number;
    roleId: number;
  }[]
) => {
  const url = "/api/games/roles/bulk";
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  const response = await axios.post(url, gamesRoles, config);
  return response.data;
};
