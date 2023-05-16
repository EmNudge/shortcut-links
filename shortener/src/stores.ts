import { writable } from "svelte/store";

export type Visbility = 'public' | 'unlisted' | 'private';
export interface Link {
    name: string;
    url: string;
    privileged?: boolean;
    hidden?: boolean;
    visibility?: Visbility;
    category?: string;
    description?: string;
}

export const linksSt = writable<Link[]>([]);

type EditModal = { type: 'edit', link: Link };
type CreateModal = { type: 'create', defaultVisibility: Visbility };
type DeleteModal = { type: 'delete', link: Link };
type Closed = { type: 'closed' };
type UserModal = { type: 'auth' }
export type ModalMode = EditModal | CreateModal | DeleteModal | UserModal | Closed;

export const modalModeSt = writable<ModalMode>({ type: 'closed' });

export const searchSt = writable('');