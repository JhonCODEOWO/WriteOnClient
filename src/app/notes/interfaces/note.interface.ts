export interface NoteInterface {
    id:        string;
    title:     string;
    content:   string;
    tags:      any[];
    is_shared: boolean;
}