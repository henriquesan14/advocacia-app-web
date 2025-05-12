import { Route } from "@angular/router";
import { ListagemComarcasComponent } from "./listagem-comarcas/listagem-comarcas.component";

export const COMARCA_ROUTES: Route[] = [
  {path: 'list', component: ListagemComarcasComponent},
];