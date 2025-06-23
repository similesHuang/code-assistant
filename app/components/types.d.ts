export interface MessageType {
    id: string;
    content: string;
    roles: "user" | "system"|'assistant';
}