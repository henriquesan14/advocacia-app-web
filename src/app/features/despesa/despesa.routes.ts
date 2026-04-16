import { Route } from "@angular/router";
import { ListagemDespesasComponent } from "./listagem-despesas/listagem-despesas.component";

export const DESPESA_ROUTES: Route[] = [
  {path: 'list', component: ListagemDespesasComponent},
];