import { Route } from "@angular/router";
import { ListagemSituacoesComponent } from "./listagem-situacoes/listagem-situacoes.component";

export const SITUACAO_ROUTES: Route[] = [
  {path: 'list', component: ListagemSituacoesComponent},
];