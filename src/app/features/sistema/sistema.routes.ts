import { Route } from "@angular/router";
import { ListagemSistemasComponent } from "./listagem-sistemas/listagem-sistemas.component";

export const SISTEMA_ROUTES: Route[] = [
  {path: 'list', component: ListagemSistemasComponent},
];