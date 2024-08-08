import { useReducer } from "react";
import { Role } from "types";

export enum ActionTypes {
  SET_NAME = "SET_NAME",
  SET_TEAM = "SET_TEAM",
}

type setName = {
  type: ActionTypes.SET_NAME;
  value: string;
};
type setTeam = {
  type: ActionTypes.SET_TEAM;
  value: "TOWNSFOLK" | "OUTSIDER" | "MINION" | "DEMON";
};

const buildInitialState = (role?: Role): Role => {
  if (role) {
    return role;
  }
  return {
    name: "",
    team: "TOWNSFOLK",
  };
};

type State = Role;
type Action = setName | setTeam;

// TODO: Add some validation logic

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_NAME:
      return { ...state, name: action.value };
    case ActionTypes.SET_TEAM:
      return { ...state, team: action.value };
    default:
      return state;
  }
};

const useRoleFormReducer = (role?: Role) => {
  const initialState = buildInitialState(role);
  const [state, dispatch] = useReducer(reducer, initialState);
  const setName = (name: string) => {
    dispatch({ type: ActionTypes.SET_NAME, value: name });
  };
  const setTeam = (team: "TOWNSFOLK" | "OUTSIDER" | "MINION" | "DEMON") => {
    dispatch({ type: ActionTypes.SET_TEAM, value: team });
  };
  return { state, setName, setTeam };
};

export default useRoleFormReducer;
