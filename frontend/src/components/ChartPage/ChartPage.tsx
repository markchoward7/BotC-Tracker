import React from "react";
import TeamChart from "./TeamChart";
import PlayerCountChart from "./PlayerCountChart";
import LocationChart from "./LocationChart";
import ScriptChart from "./ScriptChart";
import { Grid } from "@mui/material";
import RoleChart from "./RoleChart";
import DrunkChart from "./DrunkChart";

const ChartPage: React.FC = () => {
  return (
    <Grid container rowSpacing={15}>
      <Grid item xs={3}>
        <TeamChart />
      </Grid>
      <Grid item xs={3}>
        <LocationChart />
      </Grid>
      <Grid item xs={6}>
        <PlayerCountChart />
      </Grid>
      <Grid item xs={12}>
        <ScriptChart />
      </Grid>
      <Grid item xs={12}>
        <RoleChart roleType="TOWNSFOLK" />
      </Grid>
      <Grid item xs={12}>
        <RoleChart roleType="OUTSIDER" />
      </Grid>
      <Grid item xs={12}>
        <RoleChart roleType="MINION" />
      </Grid>
      <Grid item xs={12}>
        <RoleChart roleType="DEMON" />
      </Grid>
      <Grid item xs={8}>
        <DrunkChart />
      </Grid>
      <Grid item xs={12}>
        {/* SPACER TO ALLOW SHOWING LABELS ON FINAL CHART */}
        <div style={{ height: 100 }} />
      </Grid>
    </Grid>
  );
};

export default ChartPage;
