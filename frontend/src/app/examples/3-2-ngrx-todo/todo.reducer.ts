import { createReducer, on } from '@ngrx/store';

import { initialState } from './todo.model';
import * as TodoActions from './todo.actions';

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false,
  })),
  on(TodoActions.loadTodosError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.toggleTodoComplete, (state, { id }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, concluida: !todo.concluida } : todo,
    ),
  })),
);
