export interface Documento {
    id?: number;
    tipo: string;
    nome: string;
    url?: string;
    processoId?: number
    createdAt?: string
    createdByUserId?: number
    file: File
    urlLocal?: string
    path?: string
}