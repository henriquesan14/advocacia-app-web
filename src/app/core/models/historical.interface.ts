export interface Historical {
    ganhosPorMes: Dados[];
    despesasPorMes: Dados[];
}

interface Dados {
    mes: number;
    ano: number;
    total: number;
}