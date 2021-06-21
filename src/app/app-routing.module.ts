import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },  {
    path: 'home-page',
    loadChildren: () => import('./home-page/home-page.module').then( m => m.HomePagePageModule)
  },
  {
    path: 'insert-mood-modal',
    loadChildren: () => import('./insert-mood-modal/insert-mood-modal.module').then( m => m.InsertMoodModalPageModule)
  },
  {
    path: 'play-modal',
    loadChildren: () => import('./play-modal/play-modal.module').then( m => m.PlayModalPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
