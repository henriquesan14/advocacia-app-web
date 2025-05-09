import { Permissao } from "./permissao.interface";


export interface Grupo {
  id: string;
  nome: string;
  permissoes: Permissao[];
  sobAprovacao: boolean;
  createdByUserId: number;
  createdAt: string;
}
