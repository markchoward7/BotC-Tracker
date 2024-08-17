import { useAPIContext } from "context";
import React from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Game } from "types";

export type RoleChartProps = {
  roleType: "DEMON" | "MINION" | "OUTSIDER" | "TOWNSFOLK";
};

const RoleChart: React.FC<RoleChartProps> = ({ roleType }) => {
  const { games } = useAPIContext();

  const buildData = (
    games: Game[]
  ): { role: string; WINS: number; LOSSES: number }[] => {
    const fullGames = games.filter((game) => game.playerCount >= 7);
    const mapping: { [key: string]: { WINS: number; LOSSES: number } } = {};
    const result: { role: string; WINS: number; LOSSES: number }[] = [];
    fullGames.flatMap((game) => {
      game.roles
        .filter((role) => role.team === roleType)
        .map((role) => {
          if (!mapping[role.name]) {
            mapping[role.name] = { LOSSES: 0, WINS: 0 };
          }
          if (
            game.winningTeam === "EVIL" &&
            (role.team === "DEMON" || role.team === "MINION")
          ) {
            mapping[role.name].WINS += 1;
          } else if (
            game.winningTeam === "GOOD" &&
            (role.team === "TOWNSFOLK" || role.team === "OUTSIDER")
          ) {
            mapping[role.name].WINS += 1;
          } else {
            mapping[role.name].LOSSES += 1;
          }
        });
    });
    for (const role in mapping) {
      result.push({
        role,
        WINS: mapping[role].WINS,
        LOSSES: mapping[role].LOSSES,
      });
    }
    result.sort((a, b) => {
      const aTotal = a.WINS + a.LOSSES;
      const bTotal = b.WINS + b.LOSSES;
      if (aTotal > bTotal) {
        return -1;
      } else if (aTotal < bTotal) {
        return 1;
      }
      if (a.WINS > b.WINS) {
        return -1;
      }
      return 1;
    });
    return result;
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
        angle={60}
        interval={0}
        dataKey="role"
      />
      <Bar stackId={1} dataKey="WINS" fill="#00FF00">
        <LabelList
          fill="white"
          valueAccessor={({ payload }) => payload.WINS || null}
        />
      </Bar>
      <Bar stackId={1} dataKey="LOSSES" fill="#888800">
        <LabelList
          fill="white"
          valueAccessor={({ payload }) => {
            if (payload.LOSSES === 0) {
              return null;
            }
            return payload.LOSSES + payload.WINS;
          }}
        />
      </Bar>
    </BarChart>
  );
};

export default RoleChart;
