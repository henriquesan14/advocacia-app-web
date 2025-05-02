import { Avatar } from "./avatar.interface";

export interface UpdateProfile {
    nome: string;
    email: string;
    telefone: string;
    avatar: Avatar;
}