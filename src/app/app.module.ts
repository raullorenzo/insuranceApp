// Modules
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardsFreeModule } from 'angular-bootstrap-md';
import {
  MatIconModule,
  MatFormFieldModule,
  MatSelectModule,
  MatButtonModule
} from '@angular/material';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { StatementComponent } from './pages/statement/statement.component';
import { favoritesComponent } from './pages/favorites/favorites.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { AllInsurancesComponent } from './pages/all-insurances/all-insurances.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';

// Services
import { InsurancesService } from './services/insurances.service';

// Pipes
// import { SearchPipe } from './pipes/search/search.pipe';
// import { TruncatePipe } from './pipes/truncate/truncate.pipe';
// import { SortPipe } from './pipes/sort/sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalComponent,
    HeaderComponent,
    FooterComponent,
    CommentsComponent,
    StatementComponent,
    favoritesComponent,
    InsurancesComponent,
    AllInsurancesComponent,
    LoadingScreenComponent,
    // TruncatePipe,
    // SearchPipe,
    // SortPipe
  ],
  imports: [
    NgbModule,
    FormsModule,
    PipesModule,
    BrowserModule,
    MatIconModule,
    MatSelectModule,
    CardsFreeModule,
    MatButtonModule,
    FilterPipeModule,
    AppRoutingModule,
    HttpClientModule,
    NgxUiLoaderModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [
    InsurancesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
