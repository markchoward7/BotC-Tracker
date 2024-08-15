import { createContext, useContext } from "react";
import { Game, Role, Script } from "types";

export type APIContextType = {
  games: Game[];
  scripts: Script[];
  roles: Role[];
  loading: boolean;
  refresh: Function;
};

export const APIContext = createContext<APIContextType>({
  games: [],
  scripts: [],
  roles: [],
  loading: true,
  refresh: () => {},
});

const useAPIContext = () => useContext(APIContext);

export default useAPIContext;
