import type { Client } from "../../types";

export interface ClientRowProps {
  client: Client;
  onClick?: (client: Client) => void;
}