import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './commons/guards/auth.guard';
import { LoginGuard } from './commons/guards/login.guard';
import { SentEmailGuard } from './commons/guards/sent-email.guard';
import { SetPasswordGuard } from './commons/guards/set-password.guard';

import { CausalImpactComponent } from './causal-impact/causal-impact.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientReportsComponent } from './client-reports/client-reports.component';
import { ContentBriefComponent } from './content-brief/content-brief.component';
import { ContentDevelopmentComponent } from './content-development/content-development.component';
import { GeosComponent } from './keyword/geos/geos.component';
import { HomeComponent } from './home/home.component';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { KeywordAnalysisComponent } from './keyword/keyword-analysis/keyword-analysis.component';
import { KeywordCollectionComponent } from './keyword/keyword-collection/keyword-collection.component';
import { KeywordReviewComponent } from './keyword/keyword-review/keyword-review.component';
import { KeywordClassificationComponent } from './keyword/keyword-classification/keyword-classification.component';
import { LoginComponent } from './login/login.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReleasesComponent } from './releases/releases.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { ResourcingAdminComponent } from './resourcing-admin/resourcing-admin.component';
import { ExecDashboardComponent } from './exec-dashboard/exec-dashboard.component';
import { MyworkComponent } from './mywork/mywork.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ScopingComponent } from './scoping/scoping.component';
import { NgramComponent } from './ngram/ngram.component';
import { SeoForecastingComponent } from './seo-forecasting/seo-forecasting.component';
import { SetPasswordStep1Component } from './login/set-password-step1/set-password-step1.component';
import { SetPasswordStep2Component } from './login/set-password-step2/set-password-step2.component';
import { SetPasswordStep3Component } from './login/set-password-step3/set-password-step3.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { TagsComponent } from './keyword/tags/tags.component';
import { TagExplorerComponent } from './tag-explorer/tag-explorer.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'forgot-password', component: SetPasswordStep1Component },
  { path: 'change-password', component: SetPasswordStep1Component },
  { path: 'sign-up', component: SignUpComponent, canActivate: [LoginGuard] },
  { path: 'sent-email', component: SetPasswordStep2Component, canActivate: [SentEmailGuard] },
  { path: 'set-password/:token', component: SetPasswordStep3Component, canActivate: [SetPasswordGuard] },

  { path: 'causal-impact', component: CausalImpactComponent, canActivate: [AuthGuard] },
  { path: 'reviews', component: ReviewsComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'client-config', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'client-reports', component: ClientReportsComponent, canActivate: [AuthGuard] },
  { path: 'content-brief', component: ContentBriefComponent, canActivate: [AuthGuard] },
  { path: 'content-development', component: ContentDevelopmentComponent, canActivate: [AuthGuard] },
  { path: 'geos', component: GeosComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'issue-list', component: IssueListComponent, canActivate: [AuthGuard] },
  { path: 'keyword-analysis', component: KeywordAnalysisComponent, canActivate: [AuthGuard] },
  { path: 'keyword-collection', component: KeywordCollectionComponent, canActivate: [AuthGuard] },
  { path: 'keyword-review', component: KeywordReviewComponent, canActivate: [AuthGuard] },
  { path: 'keyword-classification', component: KeywordClassificationComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'releases', component: ReleasesComponent, canActivate: [AuthGuard] },
  { path: 'user-admin', component: UserAdminComponent, canActivate: [AuthGuard] },
  { path: 'mywork', component: MyworkComponent, canActivate: [AuthGuard] },
  { path: 'resourcing-admin', component: ResourcingAdminComponent, canActivate: [AuthGuard] },
  { path: 'exec-dashboard', component: ExecDashboardComponent, canActivate: [AuthGuard] },
  { path: 'scoping-admin', component: ScopingComponent, canActivate: [AuthGuard] },
  { path: 'scoping-approve', component: ScopingComponent, canActivate: [AuthGuard] },
  { path: 'ngram', component: NgramComponent, canActivate: [AuthGuard] },
  { path: 'seo-forecasting', component: SeoForecastingComponent, canActivate: [AuthGuard] },
  { path: 'tags', component: TagsComponent, canActivate: [AuthGuard] },
  { path: 'tag-explorer', component: TagExplorerComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
