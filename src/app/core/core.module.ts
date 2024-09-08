import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
      CommonModule
  ],
  providers: [
    // Put your services here (Singleton services)
  ]
})
export class AppCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: AppCoreModule) {
    if (parentModule) {
      throw new Error(`AppCoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
