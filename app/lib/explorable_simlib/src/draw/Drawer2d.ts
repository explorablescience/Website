import { Drawer2dMethods, ShapeData } from "./Drawer2dMethods";

// List of data types for different drawing methods
export type ArcData = {
    radiusX: number;
    radiusY: number;
    startAngle: number;
    endAngle: number;
}
export type VectorData = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    arrowHeadSize: number;
}
export type RectData = {
    width: number;
    height: number;
}
export type SVGData = {
    svgString: string;
}

// Default radius for shapes
const DEFAULT_RADIUS = 0.1;

/**
 * A simple 2D drawer for rendering on a canvas.
 * By default, each shape is empty and without stroke.
 * If at the end no fill or stroke color is specified, nothing will be drawn.
 * Each shape is positioned at the center (0.5, 0.5) of the canvas unless translated.
 * To draw the shape, call the `draw()` method on the returned Drawer2dMethods instance.
 */
export class Drawer2d {
    readonly aspectRatio: number = 1.0;

    private canvas: { context: CanvasRenderingContext2D; size: { width: number; height: number; }; aspectRatio: number; };
    constructor(canvas: { context: CanvasRenderingContext2D; size: { width: number; height: number; }; aspectRatio: number; }) {
        this.canvas = canvas;
        this.aspectRatio = canvas.aspectRatio;
    }


    // Utility methods
    // General drawing methods on the canvas
    /**
     * Clears the canvas with the specified color.
     * @param color - The color to fill the canvas with. Default is 'white'.
     */
    clear(color: string = 'white'): void {
        const ctx = this.canvas.context;
        const { width, height } = this.canvas.size;

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
    }


    // Drawing methods for circles, ellipses, and arcs
    /**
     * Draws a circle with the specified radius.
     * @param radius - The radius of the circle.
     * @returns A Drawer2dMethods instance for chaining further drawing commands.
     */
    circle(radius?: number): Drawer2dMethods {
        return new Drawer2dMethods(this.canvas, {
            type: 'arc',
            data: {
                radiusX: radius || DEFAULT_RADIUS,
                radiusY: radius || DEFAULT_RADIUS,
                startAngle: 0,
                endAngle: Math.PI * 2
            } as ArcData
        } as ShapeData);
    }

    /**
     * Draws an ellipse with the specified radii.
     * @param radiusX - The horizontal radius of the ellipse.
     * @param radiusY - The vertical radius of the ellipse.
     * @returns A Drawer2dMethods instance for chaining further drawing commands.
     */
    ellipse(radiusX?: number, radiusY?: number): Drawer2dMethods {
        return new Drawer2dMethods(this.canvas, {
            type: 'arc',
            data: {
                radiusX: radiusX || DEFAULT_RADIUS,
                radiusY: radiusY || DEFAULT_RADIUS,
                startAngle: 0,
                endAngle: Math.PI * 2
            } as ArcData
        } as ShapeData);
    }

    /**
     * Draws an arc with the specified parameters.
     * @param radius - The horizontal radius of the arc.
     * @param startAngle - The starting angle of the arc in radians.
     * @param endAngle - The ending angle of the arc in radians.
     * @returns A Drawer2dMethods instance for chaining further drawing commands.
     */
    arc(startAngle: number, endAngle: number, radius?: number): Drawer2dMethods {
        return new Drawer2dMethods(this.canvas, {
            type: 'arc',
            data: {
                radiusX: radius || DEFAULT_RADIUS,
                radiusY: radius || DEFAULT_RADIUS,
                startAngle,
                endAngle
            } as ArcData
        } as ShapeData);
    }


    // Rectangle drawing methods
    /**
     * Draws a square with the specified radius.
     * @param radius - The radius of the square.
     * @returns A Drawer2dMethods instance for chaining further drawing commands.
     */
    square(radius?: number): Drawer2dMethods {
        return new Drawer2dMethods(this.canvas, {
            type: 'rect',
            data: {
                width: radius || DEFAULT_RADIUS,
                height: radius || DEFAULT_RADIUS
            } as RectData
        } as ShapeData);
    }

    /**
     * Draws a rectangle with the specified width and height.
     * @param radiusX - The width of the rectangle.
     * @param radiusY - The height of the rectangle.
     * @returns A Drawer2dMethods instance for chaining further drawing commands.
     */
    rectangle(radiusX?: number, radiusY?: number): Drawer2dMethods {
        return new Drawer2dMethods(this.canvas, {
            type: 'rect',
            data: {
                width: radiusX || DEFAULT_RADIUS,
                height: radiusY || DEFAULT_RADIUS
            } as RectData
        } as ShapeData);
    }


    // SVG drawing method
    /**
     * Draws an SVG image from the provided SVG string.
     * @param svgString - The SVG string representing the image.
     * @returns A Drawer2dMethods instance for chaining further drawing commands.
     */
    svg(svgString: string): Drawer2dMethods {
        return new Drawer2dMethods(this.canvas, {
            type: 'svg',
            data: {
                svgString
            } as SVGData
        } as ShapeData);
    }

    /**
     * Draws a vector from the specified start point to the end point.
     * @param from - The starting point of the vector.
     * @param to - The ending point of the vector.
     * @param arrowHeadSize - The size of the arrowhead. Default is 0.03.
     * @returns A Drawer2dMethods instance for chaining further drawing commands.
     */
    vector(from: { x: number; y: number; }, to: { x: number; y: number; }, arrowHeadSize: number = 0.03): Drawer2dMethods {
        return new Drawer2dMethods(this.canvas, {
            type: 'vector',
            data: {
                x1: from.x,
                y1: from.y,
                x2: to.x,
                y2: to.y,
                arrowHeadSize
            } as VectorData
        } as ShapeData);
    }
}
