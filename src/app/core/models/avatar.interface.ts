export interface Avatar {
    id?: number;
    nome: string;
    url?: string;
    createdAt?: string
    createdByUserId?: number
    file: File
    urlLocal?: string
    path?: string
}