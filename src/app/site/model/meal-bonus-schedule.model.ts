export interface mealBonusSchedule {
  planName: string;
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
