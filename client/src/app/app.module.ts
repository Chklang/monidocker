import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NodesComponent } from './components/nodes/nodes.component';

@NgModule({
  declarations: [
    AppComponent,
    NodesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
