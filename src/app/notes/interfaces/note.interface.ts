export interface NoteInterface {
    id:        string;
    title:     string;
    content:   string;
    tags:      string[];
    is_shared: boolean;
}