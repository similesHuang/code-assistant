export interface MessageType {
    id:string;
    content: string;
    loading?: boolean;
    type:'user'|'assistant'|'system';
    isFile?: boolean;
    file?: {
        content: string;
        name:string;
        language: string;
    }
}