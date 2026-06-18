export interface Movimento {
    codigo: number;
    nome: string;
    dataHora: string;
    orgaoJulgador: OrgaoJulgador
}

export interface OrgaoJulgador {
    nome: string;
}