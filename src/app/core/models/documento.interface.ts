export interface Documento {
    id?: string;
    tipo: string;
    nome: string;
    url?: string;
    processoId?: string
    createdAt?: string
    createdByUserId?: number
    createdByUserName?: string
    updatedByUserName?: string
    file: File
    urlLocal?: string
    path?: string
}
