import { Route } from "@angular/router";
import { ListagemProcessosComponent } from "./listagem-processos/listagem-processos.component";
import { CadastroProcessosComponent } from "./cadastro-processos/cadastro-processos.component";

export const PROCESSOS_ROUTES: Route[] = [
  {path: '', component: ListagemProcessosComponent},
  {path: 'cadastro', component: CadastroProcessosComponent},
  {path: ':id', component: CadastroProcessosComponent},
];