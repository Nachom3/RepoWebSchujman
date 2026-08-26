import type { Client } from "@prisma/client";

export type CreateClientDto = {
  taxId?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactName?: string;
  notes?: string;
};

export type UpdateClientDto = Partial<Omit<CreateClientDto, "taxId">>;

export type ClientResponse = Pick<
  Client,
  "id" | "taxId" | "name" | "email" | "phone" | "status" | "createdAt" | "updatedAt"
>;

export type ClientListResponse = ClientResponse[];

export type ClientDetailResponse = ClientResponse & {
  address: string | null;
  contactName: string | null;
  notes: string | null;
  projects: { id: number; name: string; status: string; progressPercent: number }[];
};
