import { Processo } from "./processo.interface"
import { Usuario } from "./usuario.interface"

export interface Evento {
    id: string
    titulo: string
    tipo: string
    descricao: string
    dataEvento: string
    local: string
    linkAudiencia: string
    processoId: number
    processo: Processo
    status: string
    diaInteiro: boolean
    presencial: boolean
    responsavel: Usuario
    refId: number
    createdByUserId: number
    createdAt: string
}