// Type definitions for Swipe v2.2.13
// Project: https://github.com/lyfeyaj/swipe
// Definitions by: Felix Liu <https://github.com/lyfeyaj>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface SwipeOptions {
    startSlide?: number;
    speed?: number;
    auto?: number;
    draggable?: boolean;
    continuous?: boolean;
    autoRestart?: boolean;
    disableScroll?: boolean;
    stopPropagation?: boolean;
    callback?: (index: number, elem: HTMLElement, dir: number) => void;
    transitionEnd?: (index: number, elem: HTMLElement) => void;
}

declare class Swipe {
    constructor(container: HTMLElement, options?: SwipeOptions);
    prev(): void;
    next(): void;
    getPos(): number;
    getNumSlides(): number;
    slide(index: number, duration: number): void;
    restart(): void;
    stop(): void;
    setup(options?: SwipeOptions): void;
    kill(): void;
    disable(): void;
    enable(): void;
}
