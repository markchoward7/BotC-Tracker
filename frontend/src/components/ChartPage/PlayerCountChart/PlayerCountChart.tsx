import { useAPIContext } from "context";
import React from "react";
import { Bar, BarChart, Label, XAxis, YAxis } from "recharts";
import { Game } from "types";

const PlayerCountChart: React.FC = () => {
  const { games } = useAPIContext();

  const buildData = (
    games: Game[]
  ): { playerCount: number; EVIL: number; GOOD: number }[] => {
    const validPlayerCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15];
    return validPlayerCounts.map((playerCount) => {
      const matchingGames = games.filter(
        (game) => game.playerCount === playerCount
      );
      return {
        playerCount,
        EVIL:
          matchingGames.filter((game) => game.winningTeam === "EVIL").length ||
          null,
        GOOD:
          matchingGames.filter((game) => game.winningTeam === "GOOD").length ||
          null,
      };
    });
  };

  const data = buildData(games);

  return (
    <BarChart height={200} width={800} data={data}>
      <YAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white" }}
      />
      <XAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white" }}
        dataKey="playerCount"
      >
        <Label
          value="Player Count Win Rate"
          offset={-4}
          position="insideBottom"
        />
      </XAxis>
      <Bar dataKey="EVIL" fill="#FF0000" label={{ fill: "white" }} />
      <Bar dataKey="GOOD" fill="#0000FF" label={{ fill: "white" }} />
    </BarChart>
  );
};

export default PlayerCountChart;
