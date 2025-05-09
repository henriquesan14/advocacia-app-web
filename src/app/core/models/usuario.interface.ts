import { Avatar } from "./avatar.interface";
import { Grupo } from "./grupo.interface";


export interface Usuario {
  id: string;
  nome: string;
  email: string;
  documento: string;
  telefone: string;
  urlFoto: string;
  grupo: Grupo;
  grupoId: number;
  avatar: Avatar;
  createdAt: string;
}
