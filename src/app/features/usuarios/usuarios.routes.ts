import { Route } from "@angular/router";
import { ListagemUsuariosComponent } from "./listagem-usuarios/listagem-usuarios.component";

export const USUARIOS_ROUTES: Route[] = [
  {path: 'list', component: ListagemUsuariosComponent},
];