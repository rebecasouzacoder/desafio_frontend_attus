import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { todoReducer } from './examples/3-2-ngrx-todo/todo.reducer';
import { TodoEffects } from './examples/3-2-ngrx-todo/todo.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // só pra rota /exemplos (item 3.2) — remover junto se tirar a rota
    provideStore({ todos: todoReducer }),
    provideEffects([TodoEffects]),
  ]
};
