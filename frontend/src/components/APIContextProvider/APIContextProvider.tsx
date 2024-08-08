import { getGames, getRoles, getScripts } from "api";
import { APIContext } from "context";
import React, { useEffect, useMemo, useState, PropsWithChildren } from "react";
import { Game, Role, Script } from "types";

const APIContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getGames(), getScripts(), getRoles()]).then(
      ([games, scripts, roles]) => {
        setGames(games);
        setScripts(scripts);
        setRoles(roles);
        setLoading(false);
      }
    );
  }, []);

  const contextValue = useMemo(
    () => ({ games, scripts, roles, loading }),
    [games, scripts, roles, loading]
  );

  return (
    <APIContext.Provider value={contextValue}>{children}</APIContext.Provider>
  );
};

export default APIContextProvider;
