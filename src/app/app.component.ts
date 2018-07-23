import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GlobalEventEmitterService } from './services/EventEmitter/global-event-emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Vetahealth';
  screenSizeChangedCallback: () => void;

  constructor(private _globalEventEmitterService: GlobalEventEmitterService) {

  }

  screenSizeChanged() {
    this._globalEventEmitterService.screenSizeResizedEvent($(window).width());
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let timeout = null;

    this.screenSizeChangedCallback = () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => { this.screenSizeChanged(); }, 100);
    };
    this.screenSizeChanged();
    $(window).on('resize', this.screenSizeChangedCallback);
  }

  ngOnDestroy() {
    $(window).off('resize', this.screenSizeChangedCallback);
  }
}
