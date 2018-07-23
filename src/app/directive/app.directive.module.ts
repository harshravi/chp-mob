import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDisabledDirective } from './disabled.directive';
import { AppCarouselDirective } from './carousel.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        AppDisabledDirective,
        AppCarouselDirective
    ],
    exports: [
        AppDisabledDirective,
        AppCarouselDirective
    ]
})
export class AppDirectiveModule { }
