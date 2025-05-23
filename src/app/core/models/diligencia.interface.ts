import { Usuario } from "./usuario.interface";

export interface Diligencia {
    id: string;
    descricao: string;
    responsavel: Usuario;
    responsavelId: number;
    dataDiligencia: string;
    processoId: string;
    presencial: boolean;
    local: string;
    diaInteiro: boolean;
}