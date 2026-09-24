import { supabase } from "./client";

/**
 * Untyped view of the Supabase client, used for tables/columns that the
 * generated types file has not caught up with yet (customer profile fields,
 * order shipping/tracking fields). Row shapes are declared in src/types/customer.ts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any;
