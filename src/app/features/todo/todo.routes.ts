import { Route } from "@angular/router";
import { TodoListComponent } from "./todo-list/todo-list.component";

export const TODO_ROUTES: Route[] = [
  {path: 'list', component: TodoListComponent},
];