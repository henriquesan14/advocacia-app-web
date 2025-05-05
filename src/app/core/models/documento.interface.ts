export interface Documento {
    id?: string;
    tipo: string;
    nome: string;
    url?: string;
    processoId?: string
    createdAt?: string
    createdByUserId?: number
    file: File
    urlLocal?: string
    path?: string
}