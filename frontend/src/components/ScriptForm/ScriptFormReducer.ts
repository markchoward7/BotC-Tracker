import { useReducer } from "react";
import { Script, Role } from "types";

export enum ActionTypes {
  SET_NAME = "SET_NAME",
  SET_ROLES = "SET_ROLES",
}

type setName = {
  type: ActionTypes.SET_NAME;
  value: string;
};
type setRoles = {
  type: ActionTypes.SET_ROLES;
  value: Role[];
};

const buildInitialState = (script?: Script): Script => {
  if (script) {
    return script;
  }
  return {
    name: "",
    roles: [],
  };
};

type State = Script;
type Action = setName | setRoles;

// TODO: Add some validation logic

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_NAME:
      return { ...state, name: action.value };
    case ActionTypes.SET_ROLES:
      return { ...state, roles: action.value };
    default:
      return state;
  }
};

const useScriptFormReducer = (script?: Script) => {
  const initialState = buildInitialState(script);
  const [state, dispatch] = useReducer(reducer, initialState);
  const setName = (name: string) => {
    dispatch({ type: ActionTypes.SET_NAME, value: name });
  };
  const setRoles = (roles: Role[]) => {
    dispatch({ type: ActionTypes.SET_ROLES, value: roles });
  };
  return { state, setName, setRoles };
};

export default useScriptFormReducer;
