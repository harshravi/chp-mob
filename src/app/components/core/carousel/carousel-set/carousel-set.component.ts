import { Component, OnInit, AfterContentInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { IPerPageTileConfig } from './model/carousel-set.model';

declare var Siema: any;
declare var $: any;

@Component({
  selector: 'app-carousel-set',
  templateUrl: './carousel-set.component.html',
  styleUrls: ['./carousel-set.component.scss']
})
export class CarouselSetComponent implements OnInit, AfterContentInit, OnDestroy {
  isLoadingSiema = false;
  subscription: Subscription[] = [];

  /** Show Carousel */
  showCarousel = false;
  /** Duration of animation */
  @Input() private duration = 200;

  /** Animation function which is by default Ease Out */
  @Input() private easing = 'ease-out';

  /** Number of slides to be shown per page */
  @Input() private perPage = 1;

  /** Element from where to start from */
  @Input() private startIndex = 0;

  /** Defines if the component is draggable or not */
  @Input() private draggable = true;

  /** Threshold of dragging acrion */
  @Input() private threshold = 20;

  /** Defines whether the carousel should be looped or not */
  @Input() private loop = false;

  @Input() public button_enable: boolean = true;
  @Output() public carouselInit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() goToSlide: number;

  _noOfTileAvailable: number;
  @Input('noOfTileAvailable')

  set setNoOfTileAvailable(value: number) {

    if (!value) {
      value = 0;
    }

    this._noOfTileAvailable = value;
    this.controlPrevNextBtnVisibility();
  }

  get getNoOfTileAvailable(): number {
    return this._noOfTileAvailable;
  }

  _refreshEvent: EventEmitter<boolean>;

  @Input('refreshEvent')
  set setRefreshEvent(value: EventEmitter<boolean>) {

    this._refreshEvent = value;
    const sub = this._refreshEvent.subscribe(val => {
      this.isLoadingSiema = false;
      this.initSiema();
    });

    this.subscription.push(sub);
  }

  get getRefreshEvent() {
    return this._refreshEvent;
  }

  randomId: string;
  isPrevVisible = false;
  isNextVisible = false;

  /** Reference to the global variable Siema */
  siema: any;
  perPageConfigTiles: IPerPageTileConfig = {
    314: 1,
    640: 2,
    768: 3,
    1024: 3,
    1280: 4
  };

  constructor(private _globalEventEmitterService: GlobalEventEmitterService) {
    this.randomId = this.makeid();

    this.subscription.push(this._globalEventEmitterService.screenSizeEvent.subscribe(val => {
      this.controlPrevNextBtnVisibility(val);
    }));
  }

  ngOnInit() {

  }

  controlPrevNextBtnVisibility(width?: number) {
    if (!width) {
      width = $(window).width();
    }

    this.isPrevVisible = true;
    this.isNextVisible = true;

    if (width > 1280 && this._noOfTileAvailable <= 4) {
      this.isPrevVisible = false;
      this.isNextVisible = false;
    } else if ((width >= 768 && width < 1280) && this._noOfTileAvailable <= 3) {
      this.isPrevVisible = false;
      this.isNextVisible = false;
    } else if ((width >= 640 && width < 768) && this._noOfTileAvailable <= 2) {
      this.isPrevVisible = false;
      this.isNextVisible = false;
    } else if ((width >= 314 && width < 640) && this._noOfTileAvailable <= 1) {
      this.isPrevVisible = false;
      this.isNextVisible = false;
    }

  }

  async initSiema() {
    /** Initialization of the seima framework */
    //await this.destroySiema();

    setTimeout(() => {
      if (!this.siema && $('#' + this.randomId).length) {
        this.siema = new Siema({
          selector: '#' + this.randomId,
          duration: this.duration,
          easing: this.easing,
          perPage: this.perPageConfigTiles,
          startIndex: this.startIndex,
          draggable: this.draggable,
          threshold: this.threshold,
          loop: this.loop,
        });
        this.isLoadingSiema = true;
        if (this.goToSlide) {
          this.siema.goTo(this.goToSlide);
        }
        //this.carouselInit.emit(true);
      }
    }, 2000);
  }

  async destroySiema(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.siema) {
        this.siema.destroy(true, () => {
          this.siema = null;
          resolve();
        });
      } else {
        resolve();
      }
    });


  }

  ngAfterContentInit() {
    this.initSiema();
    this.controlPrevNextBtnVisibility();
  }

  /**
   * Method for moving the carousel unit to the next one.
   */
  next(noOfSlides): void {
    if (this.siema) {
      this.siema.next(1);
    }
  }

  /**
   * Method for moving the carousel unit to the previous one.
   */
  prev(noOfSlides): void {
    if (this.siema) {
      this.siema.prev(1);
    }
  }

  makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  unSubscribe() {
    _.forEach(this.subscription, (sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.destroySiema();
    this.unSubscribe();
  }

}
