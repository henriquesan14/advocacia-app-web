import { Estado } from "./estado.interface";

export interface Comarca {
    id: number;
    nome:string;
    estado: Estado;
    estadoId: number;
    createdAt: string;
}