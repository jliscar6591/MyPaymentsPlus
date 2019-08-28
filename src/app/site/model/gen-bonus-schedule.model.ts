export interface genBonusSchedule {
  planame: string;
  description: string;
  tiers: [
    {
      beginValue: number;
      endValue: number;
      strategy: string;
      value: number
    }
  ]
}

export interface GenInfo {
  categoryName: string;
  categoryDescription: string;
}
