import { modalModeSt, type ModalMode } from "../stores"

export const showModal = (modalType: Exclude<ModalMode, { type: 'closed' }>) => {
    modalModeSt.set(modalType);
}

export const closeModal = () => {
    modalModeSt.set({ type: 'closed' });
}