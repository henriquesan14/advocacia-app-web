import { Estado } from "./estado.interface";

export interface Comarca {
    id: string;
    nome:string;
    estado: Estado;
    estadoId: number;
    createdAt: string;
}