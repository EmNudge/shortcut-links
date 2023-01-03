import { writable } from "svelte/store";

export interface Link {
    name: string;
    url: string;
    privileged?: boolean;
    hidden?: boolean;
}

export const linksSt = writable<Link[]>([]);

type EditModal = { type: 'edit', link: Link };
type CreateModal = { type: 'create' };
type DeleteModal = { type: 'delete', link: Link };
type Closed = { type: 'closed' };
export type ModalMode = EditModal | CreateModal | DeleteModal | Closed;

export const modalModeSt = writable<ModalMode>({ type: 'closed' });

export const searchSt = writable('');