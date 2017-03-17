import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FrontendTestComponent } from './frontend-test.component';
import { routes } from './frontend-test.routing';

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: [
    FrontendTestComponent
  ]
})

export class FrontendTestModule {
}

