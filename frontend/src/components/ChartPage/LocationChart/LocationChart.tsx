import { useAPIContext } from "context";
import React from "react";
import { Bar, BarChart, Label, XAxis, YAxis } from "recharts";
import { Game } from "types";

const LocationChart: React.FC = () => {
  const { games } = useAPIContext();

  const buildData = (
    games: Game[]
  ): { location: "Online" | "In Person"; EVIL: number; GOOD: number }[] => {
    const fullGames = games.filter((game) => game.playerCount >= 7);
    return [
      {
        location: "Online",
        EVIL: fullGames.filter(
          (game) => !game.isInPerson && game.winningTeam === "EVIL"
        ).length,
        GOOD: fullGames.filter(
          (game) => !game.isInPerson && game.winningTeam === "GOOD"
        ).length,
      },
      {
        location: "In Person",
        EVIL: fullGames.filter(
          (game) => game.isInPerson && game.winningTeam === "EVIL"
        ).length,
        GOOD: fullGames.filter(
          (game) => game.isInPerson && game.winningTeam === "GOOD"
        ).length,
      },
    ];
  };

  const data = buildData(games);

  return (
    <BarChart height={200} width={400} data={data}>
      <YAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white" }}
      />
      <XAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white" }}
        dataKey="location"
      >
        <Label value="Location Win Rate" offset={-4} position="insideBottom" />
      </XAxis>
      <Bar dataKey="EVIL" fill="#FF0000" label={{ fill: "white" }} />
      <Bar dataKey="GOOD" fill="#0000FF" label={{ fill: "white" }} />
    </BarChart>
  );
};

export default LocationChart;
