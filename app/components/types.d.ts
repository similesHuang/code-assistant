export interface MessageType {
    id?: string;
    content: string;
    role: "user" | "system"|'assistant';
}