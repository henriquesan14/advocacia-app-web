import { Usuario } from "./usuario.interface";

export interface Historico {
    id: string;
    autor: string;
    dataHistorico: string;
    descricao: string;
    createdByUser: Usuario;
    processoId: number;
    grau: number;
    resultadoSentenca?: string;
    createdAt: string;
    createdBy: string;
}