export type Role = {
  id?: number;
  name: string;
  team?: string;
};

export type Game = {
  id?: number;
  date: Date;
  isInPerson: boolean;
  notes: string;
  playerCount: number;
  roles?: Role[];
  scriptId: number;
  winningTeam: "EVIL" | "GOOD";
};

export type Script = {
  id?: number;
  name: string;
  roles?: Role[];
};
