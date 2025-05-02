import { Usuario } from "./usuario.interface";

export interface Audiencia {
    id: number;
    descricao: string;
    processoId: number;
    dataAudiencia: string;
    local: string;
    responsavel: Usuario;
    responsavelId: number
    presencial: boolean
    linkAudiencia: string;
}