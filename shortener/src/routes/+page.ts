import type { Load } from "@sveltejs/kit";

export const load: Load = async ({ fetch }) => {
  return { links: fetch('/api/get-links').then(res => res.json()) };
}