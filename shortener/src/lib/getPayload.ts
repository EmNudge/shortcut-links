import { error } from "@sveltejs/kit";

// credit @ariesclark
type ShapeType = 'string' | 'number' | 'boolean';
type OptionalShapeType = `?${ShapeType}`;
type Shape = Record<string, ShapeType | OptionalShapeType>;

type TypeOfString<T extends ShapeType> = T extends "string" 
    ? string
    : T extends "number"
        ? number 
        : T extends "boolean"
            ? boolean
            : never

type TypeFromShape<T> = T extends { [key: string]: string } 
  ? { 
    [K in keyof T]: T[K] extends ShapeType
        ? TypeOfString<T[K]>
        : T[K] extends `?${infer U extends ShapeType}`
            ? TypeOfString<U> | undefined : never
  } 
  : never;

export const getPayload = async <T extends Shape>(request: Request, shape: T): Promise<TypeFromShape<T>> => {
  let payload;
  try {
    payload = await request.json();
  } catch (_e) {
    throw error(500, 'cannot find parse json body');
  }

  const malformedError = error(400, `API requires post with shape of ${JSON.stringify(shape)}`);
  if (payload === null || typeof payload !== 'object') throw malformedError;

  for (let key of Object.keys(shape)) {
    let typeValue = shape[key];

    // allow key to not be present if the type is optional
    if (typeValue[0] === '?') {
      if (!(key in payload)) continue;

      typeValue = typeValue.slice(1) as ShapeType;
    } else if (!(key in payload)) throw malformedError;

    const typeOfPayload = typeof (payload as Record<string, string>)[key];
    if (typeOfPayload !== typeValue) throw malformedError;
  }

  return payload as TypeFromShape<T>;
}
