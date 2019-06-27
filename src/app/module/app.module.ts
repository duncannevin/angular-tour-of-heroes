import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'

import { InMemoryDataService } from '../services/in-memory-data.service'
import { AppComponent } from '../app.component';
import { HeroesComponent } from '../components/heroes/heroes.component';
import { HeroDetailComponent } from '../components/hero-detail/hero-detail.component';
import { MessagesComponent } from '../components/messages/messages.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { HeroSearchComponent } from '../components/hero-search/hero-search.component';
import { FooPipe } from '../pipes/foo.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent,
    FooPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService,
      { dataEncapsulation: false }
    ),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
