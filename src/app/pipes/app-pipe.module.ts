import { NgModule } from '@angular/core';
import { ExpandEventTypePipe } from './expand-event-type/expand-event-type.pipe';
import { DefaultDateFormatPipe } from './default-date-format/default-date-format.pipe';
import { CriticalityColorPipe } from './criticality-color/criticality-color.pipe';
import { PrivilegePipe } from './privilege/privilege.pipe';
import { firstLetterCapsPipe } from './first-letter-caps/first-letter-caps.pipe';
import { FormatLungData } from './lung-function/lung-pipe-carousal';

@NgModule({
    imports: [],
    declarations: [ExpandEventTypePipe, DefaultDateFormatPipe, CriticalityColorPipe, PrivilegePipe, firstLetterCapsPipe, FormatLungData],
    exports: [ExpandEventTypePipe, DefaultDateFormatPipe, CriticalityColorPipe, PrivilegePipe, firstLetterCapsPipe, FormatLungData]
})
export class AppPipeModule { }
