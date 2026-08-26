export type PortalLoginResponse = {
  sessionToken: string;
  client: {
    id: number;
    name: string;
    taxId: string | null;
  };
};

export type PortalProjectResponse = {
  id: number;
  name: string;
  status: string;
  type: string;
  address: string | null;
  progressPercent: number;
  estimatedEnd: string | null;
};

export type PortalProjectTaskResponse = {
  id: number;
  title: string;
  status: string;
  progress: number;
};

export type PortalProjectDetailResponse = PortalProjectResponse & {
  description: string | null;
  estimatedStart: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  tasks: PortalProjectTaskResponse[];
};

export type PortalPaymentResponse = {
  id: number;
  type: string;
  method: string;
  amount: number;
  date: string;
  projectId: number | null;
};
