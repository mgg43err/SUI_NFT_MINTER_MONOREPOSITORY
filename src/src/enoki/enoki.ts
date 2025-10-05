import { EnokiClient } from "@mysten/enoki";
export const enokiClient = new EnokiClient({
  apiKey: import.meta.env.VITE_ENOKI_SECRET_KEY,
});
