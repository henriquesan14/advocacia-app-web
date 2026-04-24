import { Route } from "@angular/router";
import { ListagemDonosComponent } from "./listagem-donos/listagem-donos.component";

export const DONO_ROUTES: Route[] = [
  {path: 'list', component: ListagemDonosComponent},
];