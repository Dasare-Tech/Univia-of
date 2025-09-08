import { Routes } from '@angular/router';

export const routes: Routes = [
  {path:'', loadComponent: () => import('./features/dashbard/dashboard').then(m => m.Dashboard) },
  {path:'dashboard', loadComponent: () => import('./features/dashbard/dashboard').then(m => m.Dashboard) },
  {path:'financeiro', loadComponent: () => import('./features/finance/finance').then(m => m.Finance) },
  {path:'motoristas', loadComponent: () => import('./layout/motoristas/motoristas').then(m => m.Motoristas) },
  {path:'novo-frete', loadComponent: () => import('./layout/fretes/novo-frete').then(m => m.NovoFrete) },
  {path:'relatorio', loadComponent: () => import('./features/relatorios/relatorio').then(m => m.Relatorio) },
  {path:'clientes', loadComponent: () => import('./layout/cliente/clientes').then(m => m.Clientes) },

];
