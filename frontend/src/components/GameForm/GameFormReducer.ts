import { useReducer } from "react";
import { Game, Role } from "types";

export enum ActionTypes {
  SET_DATE = "SET_DATE",
  SET_ROLES = "SET_ROLES",
  SET_SCRIPT = "SET_SCRIPT",
  SET_WINNING_TEAM = "SET_WINNING_TEAM",
  SET_IN_PERSON = "SET_IN_PERSON",
  SET_NOTES = "SET_NOTES",
  SET_PLAYER_COUNT = "SET_PLAYER_COUNT",
}

type setDate = {
  type: ActionTypes.SET_DATE;
  value: Date;
};
type setRoles = {
  type: ActionTypes.SET_ROLES;
  value: Role[];
};
type setScript = {
  type: ActionTypes.SET_SCRIPT;
  value: number;
};
type setWinningTeam = {
  type: ActionTypes.SET_WINNING_TEAM;
  value: "EVIL" | "GOOD";
};
type setInPerson = {
  type: ActionTypes.SET_IN_PERSON;
  value: boolean;
};
type setNotes = {
  type: ActionTypes.SET_NOTES;
  value: string;
};
type setPlayerCount = {
  type: ActionTypes.SET_PLAYER_COUNT;
  value: number;
};

const buildInitialState = (game?: Game): Game => {
  if (game) {
    return game;
  }
  return {
    date: new Date(),
    isInPerson: true,
    notes: "",
    playerCount: 7,
    roles: [],
    scriptId: 0,
    winningTeam: "EVIL",
  };
};

type State = Game;
type Action =
  | setDate
  | setInPerson
  | setNotes
  | setPlayerCount
  | setRoles
  | setScript
  | setWinningTeam;

// TODO: Add some validation logic

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_DATE:
      return { ...state, date: action.value };
    case ActionTypes.SET_IN_PERSON:
      return { ...state, isInPerson: action.value };
    case ActionTypes.SET_NOTES:
      return { ...state, notes: action.value };
    case ActionTypes.SET_PLAYER_COUNT:
      return { ...state, playerCount: action.value };
    case ActionTypes.SET_ROLES:
      return { ...state, roles: action.value };
    case ActionTypes.SET_SCRIPT:
      return { ...state, scriptId: action.value };
    case ActionTypes.SET_WINNING_TEAM:
      return { ...state, winningTeam: action.value };
    default:
      return state;
  }
};

const useGameFormReducer = (game?: Game) => {
  const initialState = buildInitialState(game);
  const [state, dispatch] = useReducer(reducer, initialState);
  const setDate = (date: Date) => {
    dispatch({ type: ActionTypes.SET_DATE, value: date });
  };
  const setInPerson = (isInPerson: boolean) => {
    dispatch({ type: ActionTypes.SET_IN_PERSON, value: isInPerson });
  };
  const setNotes = (notes: string) => {
    dispatch({ type: ActionTypes.SET_NOTES, value: notes });
  };
  const setPlayerCount = (playerCount: number) => {
    dispatch({ type: ActionTypes.SET_PLAYER_COUNT, value: playerCount });
  };
  const setRoles = (roles: Role[]) => {
    dispatch({ type: ActionTypes.SET_ROLES, value: roles });
  };
  const setWinningTeam = (winningTeam: "EVIL" | "GOOD") => {
    dispatch({ type: ActionTypes.SET_WINNING_TEAM, value: winningTeam });
  };
  const setScript = (scriptId: number) => {
    dispatch({ type: ActionTypes.SET_SCRIPT, value: scriptId });
  };
  return {
    state,
    setDate,
    setInPerson,
    setNotes,
    setPlayerCount,
    setRoles,
    setWinningTeam,
    setScript,
  };
};

export default useGameFormReducer;
