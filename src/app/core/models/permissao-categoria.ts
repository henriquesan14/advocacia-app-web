import { Permissao } from "./permissao.interface";

export interface PermissaoCategoria {
    categoriaPermissao: string;
    permissoes: Permissao[];
}