import { Route } from "@angular/router";
import { ListagemEventosComponent } from "./listagem-eventos/listagem-eventos.component";

export const EVENTO_ROUTES: Route[] = [
  {path: 'list', component: ListagemEventosComponent},
];