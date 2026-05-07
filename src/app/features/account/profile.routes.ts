import { Route } from "@angular/router";
import { AtualizarPerfilComponent } from "./atualizar-perfil/atualizar-perfil.component";
import { AtualizarSenhaComponent } from "./atualizar-senha/atualizar-senha.component";

export const PROFILE_ROUTES: Route[] = [
  {path: 'update-profile', component: AtualizarPerfilComponent},
  {path: 'update-password', component: AtualizarSenhaComponent},
];