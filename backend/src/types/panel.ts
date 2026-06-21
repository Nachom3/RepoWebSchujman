export type PanelSummaryResponse = {
  monthlyIncome: number;
  m3DispatchedThisWeek: number;
  peakHours: { hour: number; count: number }[];
  paymentStatus: {
    paid: number;
    pending: number;
  };
};
