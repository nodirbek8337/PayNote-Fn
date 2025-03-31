import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { NavbarComponent } from './core/layout/navbar/navbar.component';

import { Until2005Component } from './modules/lecture/until-2005/until-2005.component';
import { Two2007Component } from './modules/lecture/two2007/two2007.component';
import { Two2008Component } from './modules/lecture/two2008/two2008.component';
import { Two2009Component } from './modules/lecture/two2009/two2009.component';
import { Two2010Component } from './modules/lecture/two2010/two2010.component';
import { Two2011Component } from './modules/lecture/two2011/two2011.component';
import { Two2012Component } from './modules/lecture/two2012/two2012.component';
import { Two2013Component } from './modules/lecture/two2013/two2013.component';
import { Two2014Component } from './modules/lecture/two2014/two2014.component';
import { Two2015Component } from './modules/lecture/two2015/two2015.component';
import { Two2016Component } from './modules/lecture/two2016/two2016.component';
import { Two2017Component } from './modules/lecture/two2017/two2017.component';
import { Two2018Component } from './modules/lecture/two2018/two2018.component';
import { Two2019Component } from './modules/lecture/two2019/two2019.component';
import { Two2020Component } from './modules/lecture/two2020/two2020.component';
import { Two2021Component } from './modules/lecture/two2021/two2021.component';
import { Two2022Component } from './modules/lecture/two2022/two2022.component';
import { Two2023Component } from './modules/lecture/two2023/two2023.component';
import { Two2024Component } from './modules/lecture/two2024/two2024.component';
import { Two2025Component } from './modules/lecture/two2025/two2025.component';
import { AllComponent } from './modules/publications/all/all.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    Until2005Component,
    Two2007Component,
    Two2008Component,
    Two2009Component,
    Two2010Component,
    Two2011Component,
    Two2012Component,
    Two2013Component,
    Two2014Component,
    Two2015Component,
    Two2016Component,
    Two2017Component,
    Two2018Component,
    Two2019Component,
    Two2020Component,
    Two2021Component,
    Two2022Component,
    Two2023Component,
    Two2024Component,
    Two2025Component,
    AllComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    RouterModule
],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
