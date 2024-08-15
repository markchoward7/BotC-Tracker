import { useAPIContext } from "context";
import React from "react";
import { Bar, BarChart, Label, XAxis, YAxis } from "recharts";

const TeamChart: React.FC = () => {
  const { games } = useAPIContext();
  const fullGames = games.filter((game) => game.playerCount >= 7);
  const data = {
    EVIL: fullGames.filter((game) => game.winningTeam === "EVIL").length,
    GOOD: fullGames.filter((game) => game.winningTeam === "GOOD").length,
  };

  return (
    <BarChart height={200} width={400} data={[data]}>
      <YAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white" }}
      />
      <XAxis axisLine={{ stroke: "white" }} tick={false}>
        <Label value="Team Win Rate" position="insideBottom" />
      </XAxis>
      <Bar dataKey="EVIL" fill="#FF0000" label={{ fill: "white" }} />
      <Bar dataKey="GOOD" fill="#0000FF" label={{ fill: "white" }} />
    </BarChart>
  );
};

export default TeamChart;
