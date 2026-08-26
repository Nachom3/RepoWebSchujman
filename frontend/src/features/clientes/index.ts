export { ClientList } from "./components/ClientList/ClientList";
export { ClientDetail } from "./components/ClientDetail/ClientDetail";
export { ClientForm } from "./components/ClientForm/ClientForm";
export { useClients } from "./hooks/useClients";
export { useClient } from "./hooks/useClient";
export {
  formatCurrency,
  formatDate,
  getClientStatusLabel,
  getClientStatusBadgeVariant,
} from "./presentation";
export type {
  Client,
  ClientDetail as ClientDetailData,
  ClientStatus,
  CreateClientFormData,
  UpdateClientFormData,
} from "./types";
