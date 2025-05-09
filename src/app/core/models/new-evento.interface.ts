export interface NewEvento {
    id: string;
    titulo: string
    tipo: string
    descricao: string
    dataInicio: string
    dataFim: string
    local: string
    nroProcesso: string
    participantes: number[]
}