
declare var $: any;
declare var Pikaday: any;
declare var moment: any;

declare interface Dictionary<T> {
    [index: string]: T;
}

declare interface IMoment {
    isSameOrAfter: (IMoment) => IMoment;
    format: (string) => number;
    add(number, string): IMoment;
    subtract(number, string): IMoment;
}

declare class Dropdown {
    constructor(ele: any, options?: any);

}

declare function scopeSelectorAll(selector: string, ele: any);

declare interface Window {
    stopPropagationEmitterService: any;
}