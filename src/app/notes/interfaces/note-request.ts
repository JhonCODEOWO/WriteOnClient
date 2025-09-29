import { TagInterface } from "../../tags/interfaces/tag.interface";

/**
 *  Structure of a json request to make requests related with a note resource.
 */
export interface NoteResourceRequest {
    title: string;
    content: string;
    is_shared: boolean;
    /** Array of ids to update or names if is in create*/
    tags: string[];
}