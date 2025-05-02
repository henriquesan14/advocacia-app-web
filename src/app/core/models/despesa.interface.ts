import { Processo } from "./processo.interface";

export interface Despesa {
    id: number;
    tipo: string;
    valor: number;
    dataVencimento: string;
    dataPagamento?: string;
    status: string;
    observacoes?: string;
    processoId?: number;
    nroProcesso?: string;
    processo?: Processo;
}