export type User = {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    notes: Note[],
    sharedNotes: SharedNote[],
    histories: History[]
}

export type Note = {
    id: number,
    title: string,
    description: string,
    in_history: number,
	user_id: number,
    user: User,
    tags: Tag[],
    sharedWith: User,
    attachments: NoteAttachment[],
}

export type NoteTag = {
    id: number,
    note_id: number,
    tag_id: number,
    note: Note,
    tag: Tag
}

export type NoteAttachment = {
    id: number,
    note_id: number,
    path: string,
    note: Note
}

export type Tag = {
    id: number,
    name: string,
    notes: Note[]
}

export type History = {
    id: number,
    user_id: number,
    note_id: number,
	expires: string,
    note: Note,
    user: User
}

export type SharedNote = {
    id: number,
    note_id: number,
    user_id: number,
    user: User,
    note: Note,
}

export interface AuthContextValue {
    user: User | null,
    authenticated: boolean,
    login: (credentials: any) => Promise<void>,
    register: (credentials: any) => Promise<void>,
    logout: () => Promise<void>,
}
