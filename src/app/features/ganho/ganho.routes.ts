import { Route } from "@angular/router";
import { ListagemGanhosComponent } from "./listagem-ganhos/listagem-ganhos.component";

export const GANHO_ROUTES: Route[] = [
  {path: 'list', component: ListagemGanhosComponent},
];