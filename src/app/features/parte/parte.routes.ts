import { Route } from "@angular/router";
import { ListagemPartesComponent } from "./listagem-partes/listagem-partes.component";

export const PARTE_ROUTES: Route[] = [
  {path: 'list', component: ListagemPartesComponent},
];