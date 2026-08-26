// Re-export the client-payments feature router so /routes/* stays the single
// place to wire URL -> router. Feature code lives under features/client-payments.
export { clientPaymentsRouter } from "../features/client-payments/clientPaymentsRouter";
