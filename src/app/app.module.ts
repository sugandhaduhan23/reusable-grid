import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UiGridComponent } from './common/ui-grid/ui-grid.component';
import { AlertBoxComponent } from './common/alert-box/alert-box.component';
import { DeviceComponent } from './components/device/device.component';
import { FormsModule } from '@angular/forms';
import { DynamicPipe } from './pipes/dynamic-pipe.pipe';
import { Device1Component } from './components/device1/device1.component';

@NgModule({
  declarations: [
    AppComponent,
    UiGridComponent,
    AlertBoxComponent,
    DeviceComponent,
    DynamicPipe,
    Device1Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DynamicPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
