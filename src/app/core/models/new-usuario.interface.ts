import { Avatar } from "./avatar.interface";

export interface NovoUsuario {
    id: number;
    nome: string;
    email: string;
    urlFoto: string;
    grupoId: number;
    createdAt: string;
    createdByUserId: number;
    avatar: Avatar;
}