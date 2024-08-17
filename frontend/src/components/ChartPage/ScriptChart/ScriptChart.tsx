import { useAPIContext } from "context";
import React from "react";
import { Bar, BarChart, Label, LabelList, XAxis, YAxis } from "recharts";
import { Game } from "types";

const ScriptChart: React.FC = () => {
  const { games, scripts } = useAPIContext();
  const scriptTable: { [key: number]: string } = {};
  scripts.forEach((script) => {
    const shortName = script.name.replace(/v\d/, "").trim();
    scriptTable[script.id] = shortName;
  });

  const buildData = (
    games: Game[]
  ): { script: string; EVIL: number; GOOD: number }[] => {
    const fullGames = games.filter((game) => game.playerCount >= 7);
    const uniqueScripts = [
      ...new Set(fullGames.map((game) => scriptTable[game.scriptId])),
    ].sort((a, b) => {
      if (a === "Trouble Brewing") {
        return -1;
      }
      if (b === "Trouble Brewing") {
        return 1;
      }
      if (a === "Bad Moon Rising") {
        return -1;
      }
      if (b === "Bad Moon Rising") {
        return 1;
      }
      if (a === "Sects and Violets") {
        return -1;
      }
      if (b === "Sects and Violets") {
        return 1;
      }
      if (a === "Trouble Brewing +1") {
        return -1;
      }
      if (b === "Trouble Brewing +1") {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 1;
    });
    return uniqueScripts.map((script) => {
      const matchingGames = fullGames.filter(
        (game) => scriptTable[game.scriptId] === script
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
        <Label value="Script Win Rate" offset={-120} position="insideBottom" />
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
