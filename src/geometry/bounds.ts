export interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}

export interface SelectionBox {
    left: number;
    top: number;
    width: number;
    height: number;
}

/** Illustrator Y grows upward: top is max Y. */
export function makeBounds(left: number, top: number, width: number, height: number): Bounds {
    return {
        left,
        top,
        right: left + width,
        bottom: top - height,
        width,
        height,
        centerX: left + width / 2,
        centerY: top - height / 2,
    };
}

/** Mode A — one global bounding box for the whole selection. */
export function globalBounds(items: SelectionBox[]): Bounds | null {
    if (!items || items.length === 0) return null;
    let minL = Infinity, maxT = -Infinity, maxR = -Infinity, minB = Infinity;
    for (const b of items) {
        if (b.left < minL) minL = b.left;
        if (b.top > maxT) maxT = b.top;
        if (b.left + b.width > maxR) maxR = b.left + b.width;
        if (b.top - b.height < minB) minB = b.top - b.height;
    }
    return makeBounds(minL, maxT, maxR - minL, maxT - minB);
}
