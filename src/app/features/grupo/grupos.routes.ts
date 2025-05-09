import { Route } from "@angular/router";
import { ListagemGruposComponent } from "./listagem-grupos/listagem-grupos.component";

export const GRUPOS_ROUTES: Route[] = [
  {path: 'list', component: ListagemGruposComponent},
];