import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { environment } from '../../../environments/environments';
import { Todo } from './todo.model';
import * as TodoActions from './todo.actions';

// o enunciado libera URL fictícia, mas como o projeto já tem um json-server
// rodando (npm run api), apontei pra ele — dá pra ver o effect completando de
// verdade em vez de sempre cair no catchError
@Injectable()
export class TodoEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.http.get<Todo[]>(`${environment.apiUrl}/todos`).pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
          catchError((error) =>
            of(TodoActions.loadTodosError({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
