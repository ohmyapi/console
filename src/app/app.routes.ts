import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./routes/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: '-',
        loadChildren: () => import('./routes/panel/panel.module').then((m) => m.PanelModule),
    },
];
