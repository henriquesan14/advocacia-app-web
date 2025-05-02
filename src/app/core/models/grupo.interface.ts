import { Permissao } from "./permissao.interface";


export interface Grupo {
  nome: string;
  permissoes: Permissao[];
  sobAprovacao: boolean;
  id: number;
  createdByUserId: number;
  createdAt: string;
}
