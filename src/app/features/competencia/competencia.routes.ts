import { Route } from "@angular/router";
import { ListagemCompetenciasComponent } from "./listagem-competencias/listagem-competencias.component";

export const COMPETENCIA_ROUTES: Route[] = [
  {path: 'list', component: ListagemCompetenciasComponent},
];