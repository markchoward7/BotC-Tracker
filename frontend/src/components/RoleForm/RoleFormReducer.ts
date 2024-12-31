import { useReducer } from "react";
import { Role } from "types";

export enum ActionTypes {
  SET_NAME = "SET_NAME",
  SET_TEAM = "SET_TEAM",
  SET_HOMEBREW = "SET_HOMEBREW",
}

type setName = {
  type: ActionTypes.SET_NAME;
  value: string;
};
type setTeam = {
  type: ActionTypes.SET_TEAM;
  value: "TOWNSFOLK" | "OUTSIDER" | "MINION" | "DEMON";
};
type setHomebrew = {
  type: ActionTypes.SET_HOMEBREW;
  value: boolean
}

const buildInitialState = (role?: Role): Role => {
  if (role) {
    return role;
  }
  return {
    name: "",
    team: "TOWNSFOLK",
    homebrew: false,
  };
};

type State = Role;
type Action = setName | setTeam | setHomebrew;

// TODO: Add some validation logic

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_NAME:
      return { ...state, name: action.value };
    case ActionTypes.SET_TEAM:
      return { ...state, team: action.value };
    case ActionTypes.SET_HOMEBREW:
      return { ...state, homebrew: action.value };
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
  const setHomebrew = (homebrew: boolean) => {
    dispatch({ type: ActionTypes.SET_HOMEBREW, value: homebrew });
  }
  return { state, setName, setTeam, setHomebrew };
};

export default useRoleFormReducer;
