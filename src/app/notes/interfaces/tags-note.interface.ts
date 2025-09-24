import { TagInterface } from "../../tags/interfaces/tag.interface";

/**
 *  Use this interface to transfer data about tags with a note related
 */
export interface TagsNote {
    noteId: string;
    tags: TagInterface[];
}