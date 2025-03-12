import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseTrackerRoutingModule } from './expense-tracker-routing.module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ExpenseTrackerRoutingModule
  ]
})
export class ExpenseTrackerModule { }
