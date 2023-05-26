import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './commons/services/login.service';
import { BlockTemplateComponent } from './commons/block-template/block-template.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public blockTemplate: BlockTemplateComponent = BlockTemplateComponent;
  public isLoggedIn;

  private loginServiceSubscriber;
  // private localStoreSubscriber;
  public menuExpanded = false;

  constructor(private loginService: LoginService, 
              public router: Router,
              private gtmService: GoogleTagManagerService) {
    const navEndEvents = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    );

    // navEndEvents.subscribe((event: NavigationEnd) => {
    //   gtag('config', 'UA-136919728-1', {
    //     'page_path': window.location.href.replace(window.location.origin, '')
    //   });
    // });
  }

  customEvent() {

    // push GTM data layer with a custom event
    const gtmTag = {
      event: 'button-click',
      data: 'my-custom-event',
    };
    this.gtmService.pushTag(gtmTag);

    alert('this is a custom event');
  }

  ngOnInit() {
    // push GTM data layer for every visited page
    this.router.events.forEach(item => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url
        };
        this.gtmService.pushTag(gtmTag);
      }
    });

    this.isLoggedIn = false;

    this.loginServiceSubscriber = this.loginService.isLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
  }

  public _changeMenu(newApp) {
//    this.activeApp = newApp;
  }

  public _onBackdropClicked() {
 
  }

  public onMenuExpand(parameter) {
    this.menuExpanded = parameter;
  }

  public _login() {}

  ngOnDestroy() {
    this.loginServiceSubscriber.unsubscribe();
  }
}
