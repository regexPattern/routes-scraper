import { AppRoutingModule } from './app-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { ContractStakeholdersComponent } from './clients/contract-stakeholders/contract-stakeholders.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientReportsComponent } from './client-reports/client-reports.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { environment } from './../environments/environment';
import { GeoDetailsComponent } from './keyword/geos/geo-details/geo-details.component';
import { HttpErrorInterceptor } from './commons/interceptors/http-error-interceptor';
import { KeywordClassificationComponent } from './keyword/keyword-classification/keyword-classification.component';
import { KeywordTagsComponent } from './keyword/keyword-tags/keyword-tags.component';
import { LoginComponent } from './login/login.component';
import { MessageComponent } from './commons/message/message.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SetPasswordStep1Component } from './login/set-password-step1/set-password-step1.component';
import { SetPasswordStep2Component } from './login/set-password-step2/set-password-step2.component';
import { SetPasswordStep3Component } from './login/set-password-step3/set-password-step3.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { TokenInteceptor } from './commons/interceptors/token-inteceptor';

import { DialogComponent } from './commons/dialogs/dialog.component';
import { DialogService } from './commons/dialogs/dialog.service';
import { BlockTemplateComponent } from './commons/block-template/block-template.component';
import { ProfileComponent } from './commons/profile/profile.component';
import { ProfilePicComponent } from './commons/profile-pic/profile-pic.component';
import { CalendarDateComponent } from './commons/calendar-date/calendar-date.component';
import { YearPickerComponent } from './commons/year-picker/year-picker.component';
import { MonthPickerComponent } from './commons/month-picker/month-picker.component';
import { DropdownGridComponent } from './commons/dropdown-grid/dropdown-grid.component';

import { SearchItemPipe } from './commons/pipes/search-item.pipe';
import { EditNameComponent } from './edit-name/edit-name.component';
import { QuestionComponent } from './commons/dialogs/question/question.component';
import { OrderByPipe } from './commons/pipes/order-by.pipe';
import { FilterByPipe } from './commons/pipes/filter-by.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { KeywordCollectionComponent } from './keyword/keyword-collection/keyword-collection.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { UserAssociationsComponent } from './user-admin/user-associations/user-associations.component';
import { SignatureComponent } from './reviews/signature/signature.component';
import { NotificationShowComponent } from './notifications/notification-show/notification-show.component';
import { HiringCalculatorComponent } from './resourcing-admin/hiring-calculator/hiring-calculator.component';
import { ApproveOverComponent } from './resourcing-admin/approve-over/approve-over.component';
import { KeywordReviewComponent } from './keyword/keyword-review/keyword-review.component';
import { ChangeMultipleComponent} from './keyword/change-multiple/change-multiple.component';
import { TagsComponent } from './keyword/tags/tags.component';
import { GeosComponent } from './keyword/geos/geos.component';
import { KeywordAnalysisComponent } from './keyword/keyword-analysis/keyword-analysis.component';
import { FileUtil } from './file.util';
import { NotesComponent } from './notes/notes.component';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './login/change-password/change-password.component';
import { IssueEntryComponent } from './issues/issue-entry/issue-entry.component';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { NgramComponent } from './ngram/ngram.component';
import { NgramKeywordsComponent } from './ngram/ngram-keywords/ngram-keywords.component';
import { SeoForecastingComponent } from './seo-forecasting/seo-forecasting.component';
import { SeoForecastingKeywordsComponent } from './seo-forecasting-keywords/seo-forecasting-keywords.component';
import { MyworkComponent } from './mywork/mywork.component';
import { ResourcingAdminComponent } from './resourcing-admin/resourcing-admin.component';
import { ExecDashboardComponent } from './exec-dashboard/exec-dashboard.component';
import { ReleasesComponent } from './releases/releases.component';
import { CausalImpactComponent } from './causal-impact/causal-impact.component';
import { CausalOutputsComponent } from './causal-outputs/causal-outputs.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotificationsComponent } from './notifications/notifications.component';
import { ContentBriefComponent } from './content-brief/content-brief.component';
import { TagExplorerComponent } from './tag-explorer/tag-explorer.component';
import { ContentDevelopmentComponent } from './content-development/content-development.component';
import { ScopingComponent } from './scoping/scoping.component';

import { EditorModule } from '@tinymce/tinymce-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as annotation from 'highcharts/modules/annotations';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as HC_exporting from 'highcharts/modules/export-data.src';
export function highchartsModules() {
  return [ exporting, HC_exporting, more, annotation ];
}

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  MicrosoftLoginProvider
} from '@abacritt/angularx-social-login';

import { SafePipe } from './safe.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const DOMAIN = environment.nodeServerUrl.replace('http://', '').replace('https://', '');

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem(environment.prefix + 'accessToken');
    },
    whitelistedDomains: [DOMAIN],
    blacklistedRoutes: [environment.nodeServerUrl + '/auth/token']
  };
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarComponent,
        GeoDetailsComponent,
        KeywordTagsComponent,
        KeywordClassificationComponent,
        ClientsComponent,
        ClientReportsComponent,
        ReviewsComponent,
        MessageComponent,
        SetPasswordStep1Component,
        SetPasswordStep2Component,
        SetPasswordStep3Component,
        SignUpComponent,
        DialogComponent,
        BlockTemplateComponent,
        ProfileComponent,
        ProfilePicComponent,
        CalendarDateComponent,
        YearPickerComponent,
        MonthPickerComponent,
        DropdownGridComponent,
        SearchItemPipe,
        EditNameComponent,
        QuestionComponent,
        OrderByPipe,
        FilterByPipe,
        KeywordCollectionComponent,
        UserAdminComponent,
        UserAssociationsComponent,
        SignatureComponent,
        NotificationShowComponent,
        HiringCalculatorComponent,
        ApproveOverComponent,
        KeywordReviewComponent,
        ChangeMultipleComponent,
        TagsComponent,
        GeosComponent,
        KeywordAnalysisComponent,
        NotesComponent,
        HomeComponent,
        ChangePasswordComponent,
        IssueEntryComponent,
        IssueListComponent,
        NgramComponent,
        NgramKeywordsComponent,
        SeoForecastingComponent,
        SeoForecastingKeywordsComponent,
        ContractStakeholdersComponent,
        CausalOutputsComponent,
        MyworkComponent,
        ResourcingAdminComponent,
        ExecDashboardComponent,
        ReleasesComponent,
        CausalImpactComponent,
        NotificationsComponent,
        ContentBriefComponent,
        TagExplorerComponent,
        ContentDevelopmentComponent,
        ScopingComponent,
        SafePipe
    ],
    imports: [
        ChartModule,
        NgChartsModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatDialogModule,
        HttpClientModule,
        MatDividerModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatToolbarModule,
        MatExpansionModule,
        MatNativeDateModule,
        MatTableModule,
        MatSelectModule,
        MatStepperModule,
        MatTabsModule,
        MatTreeModule,
        MatDatepickerModule,
        MatButtonToggleModule,
        MatMenuModule,
        RouterModule,
        MatSidenavModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        DragDropModule,
        AppRoutingModule,
        EditorModule,
        BlockUIModule.forRoot({
            template: BlockTemplateComponent,
            delayStart: 500,
            delayStop: 500
        }),
        BlockUIHttpModule.forRoot(),
        ToastrModule.forRoot({
            closeButton: true
        }),
        AgGridModule,
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory
            }
        }),
        BsDatepickerModule.forRoot(),
        GoogleTagManagerModule.forRoot({
            id: 'GTM-TCGD57K',
        }),
        AngularEditorModule,
        SocialLoginModule,
        NgxDaterangepickerMd.forRoot()
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInteceptor,
            multi: true
        },
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
              autoLogin: false,
              providers: [
                {
                  id: GoogleLoginProvider.PROVIDER_ID,
                  provider: new GoogleLoginProvider(
                    '441537575167-5ncanibb5fk6o0lg5vj6oveadiulnfss.apps.googleusercontent.com'
                  )
                },
                {
                  id: FacebookLoginProvider.PROVIDER_ID,
                  provider: new FacebookLoginProvider('561602290896109')
                },
                {
                  id: MicrosoftLoginProvider.PROVIDER_ID,
                  provider: new MicrosoftLoginProvider('c30d6f5a-e7d9-45ea-a1ef-70e492691686', {
                    redirect_uri: 'https://localhost:4200',
                    logout_redirect_uri: 'https://localhost:4200/logout'
                  }),
                }              ],
              onError: (err) => {
                console.error(err);
              }
            } as SocialAuthServiceConfig,
          },
        DialogService,
        FileUtil,
        { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting, HC_exporting, annotation ] }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
