import { CollaboratorInterface } from "../../collaborators/interfaces/collaborator-interface";

export interface NoteInterface {
    id:        string;
    title:     string;
    content:   string;
    tags:      string[];
    is_shared: boolean;
    collaborators: CollaboratorInterface[];
    owner: CollaboratorInterface;
}