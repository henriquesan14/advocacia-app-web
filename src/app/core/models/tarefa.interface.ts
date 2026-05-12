import { Processo } from "./processo.interface";
import { Usuario } from "./usuario.interface";

export interface Tarefa {
    id: string;
    titulo: string;
    descricao: string;
    responsavel: Usuario;
    createdByUser: Usuario;
    status: string;
    urgencia: string;
    processo?: Processo;
    createdAt: string;
}