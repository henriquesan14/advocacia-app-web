import { Processo } from "./processo.interface";

export interface Ganho {
    id: string;
    fonte: string;
    valor: number;
    dataRecebimento: string;
    status: string;
    processoId?: number;
    processo?: Processo;
    nroProcesso?: string;
    createdByUserId: number;
}