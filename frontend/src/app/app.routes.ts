import { Routes } from '@angular/router';
import { UsersListComponent } from './features/users/pages/users-list/users-list.component';

export const routes: Routes = [
    {path: '', redirectTo: 'users-list', pathMatch: 'full',},
    {path: 'users-list', component: UsersListComponent},
    {
        path: 'exemplos',
        loadComponent: () =>
            import('./examples/demo/examples-demo.component').then(
                (m) => m.ExamplesDemoComponent,
            ),
    },
];
