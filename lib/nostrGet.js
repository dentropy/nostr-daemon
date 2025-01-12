import { SimplePool } from "nostr-tools/pool";
export async function nostrGet(relays, filter) {
  const pool = new SimplePool();
  const events = await pool.querySync(relays, filter);
  return events;
}
