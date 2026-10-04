export const MAX_DIVISIONS = 360;
export const CENTER_DOT_R = 2.5;

export interface GridLine {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/** Radial grid lines from center, rotated by rotationDeg. angleStep = 360 / N. */
export function radialLines(
    centerX: number,
    centerY: number,
    radius: number,
    divisions: number,
    rotationDeg: number
): { angleStep: number; lines: GridLine[] } {
    const rot = (rotationDeg * Math.PI) / 180;
    const angleStep = 360 / divisions;
    const lines: GridLine[] = [];
    for (let i = 0; i < divisions; i++) {
        const a = rot + ((i * angleStep) * Math.PI) / 180;
        lines.push({
            x1: centerX,
            y1: centerY,
            x2: centerX + radius * Math.cos(a),
            y2: centerY + radius * Math.sin(a),
        });
    }
    return { angleStep, lines };
}

/** Center marker: crosshair of half-length L + dot radius. */
export function centerMarker(
    centerX: number,
    centerY: number,
    halfLen: number
): { dotRadius: number; lines: GridLine[] } {
    return {
        dotRadius: CENTER_DOT_R,
        lines: [
            { x1: centerX - halfLen, y1: centerY, x2: centerX + halfLen, y2: centerY },
            { x1: centerX, y1: centerY - halfLen, x2: centerX, y2: centerY + halfLen },
        ],
    };
}
