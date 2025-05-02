import { Audiencia } from "./audiencia.interface"
import { Comarca } from "./comarca.interface"
import { Competencia } from "./competencia.interface"
import { Diligencia } from "./diligencia.interface"
import { Documento } from "./documento.interface"
import { Dono } from "./dono.interface"
import { Historico } from "./historico.interface"
import { Parte } from "./parte.interface"
import { Sistema } from "./sistema.interface"
import { SituacaoProcesso } from "./situacao-processo.interface"
import { Usuario } from "./usuario.interface"

export interface Processo {
    id: number
    dono: Dono
    donoId: number
    advogadoId: number
    autores: Parte[]
    reus: Parte[]
    tipoAcao: string
    nroProcesso: string
    vara: string
    comarca: Comarca
    comarcaId: number
    competencia: Competencia
    competenciaId: number
    audiencias: Audiencia[]
    diligencias: Diligencia[]
    situacao: SituacaoProcesso
    situacaoId: number
    responsavelProcesso: Usuario
    resposanvelId: number
    historico: Historico[]
    aprovado: boolean
    createdAt: string;
    createdByUserId: number;
    updatedAt: string;
    dias: number;
    observacao: string;
    segredoJustica: boolean;
    dataDistribuicao: string;
    sistema: Sistema
    documentos: Documento[]
    dataUltimoHistorico: string;
  }
  