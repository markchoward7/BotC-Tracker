import { useAPIContext } from "context";
import React from "react";
import { Bar, BarChart, Label, LabelList, XAxis, YAxis } from "recharts";
import { Game } from "types";

const ScriptChart: React.FC = () => {
  const { games, scripts } = useAPIContext();

  const matchScript = (game: Game): string => {
    return scripts.find((script) => script.id === game.scriptId).name;
  };

  const buildData = (
    games: Game[]
  ): { script: string; EVIL: number; GOOD: number }[] => {
    const fullGames = games.filter((game) => game.playerCount >= 7);
    const uniqueScripts = [...new Set(fullGames.map(matchScript))];
    return uniqueScripts.map((script) => {
      const matchingGames = fullGames.filter(
        (game) => matchScript(game) === script
      );
      return {
        script,
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
    <BarChart
      height={300}
      width={1600}
      data={data}
      {...{ overflow: "visible" }}
    >
      <YAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white" }}
      />
      <XAxis
        axisLine={{ stroke: "white" }}
        tickLine={{ stroke: "white" }}
        tick={{ stroke: "white", textAnchor: "left" }}
        angle={45}
        dataKey="script"
      >
        <Label value="Script Win Rate" offset={-4} position="insideBottom" />
      </XAxis>
      <Bar stackId={1} dataKey="EVIL" fill="#FF0000">
        <LabelList fill="white" valueAccessor={({ payload }) => payload.EVIL} />
      </Bar>
      <Bar stackId={1} dataKey="GOOD" fill="#0000FF">
        <LabelList fill="white" valueAccessor={({ payload }) => payload.GOOD} />
      </Bar>
    </BarChart>
  );
};

export default ScriptChart;
