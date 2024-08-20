import { useAPIContext } from "context";
import React from "react";
import { Bar, BarChart, Label, XAxis, YAxis } from "recharts";
import { Game } from "types";

const DrunkChart: React.FC = () => {
  const { games, roles } = useAPIContext();

  const buildData = (games: Game[]): { role: string; value: number }[] => {
    const fullGames = games.filter((game) => game.playerCount >= 7);
    const drunkGames = fullGames.filter((game) => game.drunkSawRoleId);
    const uniqueRoles = [
      ...new Set(drunkGames.map((game) => game.drunkSawRoleId)),
    ];
    return uniqueRoles.map((role) => {
      const matchingGames = drunkGames.filter(
        (game) => game.drunkSawRoleId === role
      );
      return {
        role: roles.find((r) => r.id === role).name,
        value: matchingGames.length,
      };
    });
  };

  const data = buildData(games);

  return (
    <BarChart height={300} width={800} data={data} {...{ overflow: "visible" }}>
      <YAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white" }}
      />
      <XAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white", textAnchor: "left" }}
        angle={60}
        interval={0}
        dataKey="role"
      >
        <Label value="Drunk Role" position="right" />
      </XAxis>
      <Bar dataKey="value" fill="#00FF00" />
    </BarChart>
  );
};

export default DrunkChart;
