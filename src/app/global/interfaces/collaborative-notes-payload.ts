import { NoteInterface } from "../../notes/interfaces/note.interface";

export interface CollaborativeNotesPayload {
    status: "DETACHED" | "ASSIGNED" | "UPDATED";
    note: NoteInterface;
}