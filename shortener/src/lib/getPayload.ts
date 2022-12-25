import { error } from "@sveltejs/kit";

export const getPayload = async <T extends Record<string, string>>(request: Request, shape: T): Promise<T> => {
  let payload;
  try {
    payload = await request.json();
  } catch (_e) {
    throw error(500, 'cannot find parse json body');
  }

  const malformedError = error(400, `API requires post with shape of ${JSON.stringify(shape)}`);
  if (payload === null || typeof payload !== 'object') throw malformedError;

  for (const key of Object.keys(shape)) {
    if (!(key in payload)) throw malformedError;
    if (typeof (payload as Record<string, string>)[key] !== shape[key]) throw malformedError;
  }

  return payload as T;
}
