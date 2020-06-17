import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './main/pages/pages.module';
import { ToolbarModule } from './main/components/toolbar/toolbar.module';
import { ProgressBarModule } from './main/components/progress-bar/progress-bar.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SidebarService } from './main/services/sidebar.service';
import { MatListModule } from '@angular/material/list';
import { MenuItemModule } from './main/components/menu-item/menu-item.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavigationService } from './main/services/navigation.service';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
        }),
        MatSidenavModule,
        ToolbarModule,
        ProgressBarModule,
        MatSnackBarModule,
        PagesModule,
        MatListModule,
        MenuItemModule,
        FlexLayoutModule,
    ],
    providers: [SidebarService, NavigationService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
