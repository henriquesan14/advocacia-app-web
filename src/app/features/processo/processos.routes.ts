import { Route } from "@angular/router";
import { ListagemProcessosComponent } from "./listagem-processos/listagem-processos.component";
import { CadastroProcessosComponent } from "./cadastro-processos/cadastro-processos.component";
import { PendingChangesGuard } from "../../core/guards/pending-changes.guard";

export const PROCESSOS_ROUTES: Route[] = [
  {path: 'list', component: ListagemProcessosComponent},
  {path: 'cadastro', component: CadastroProcessosComponent, canDeactivate: [PendingChangesGuard]},
  {path: ':id', component: CadastroProcessosComponent},
];