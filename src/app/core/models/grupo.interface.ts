import { Permissao } from "./permissao.interface";


export interface Grupo {
  id: string;
  nome: string;
  permissoes: Permissao[];
  createdByUserId: number;
  createdAt: string;
  createdByUserName: string;
  updatedByUserName: string;
}
