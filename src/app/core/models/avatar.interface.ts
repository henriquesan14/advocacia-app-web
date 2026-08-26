export interface Avatar {
    id?: number;
    nome: string;
    url?: string;
    createdAt?: string
    createdByUserId?: number
    createdByUserName?: string
    updatedByUserName?: string
    file: File
    urlLocal?: string
    path?: string
}
