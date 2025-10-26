import { ArcData, RectData, SVGData, VectorData } from "./Drawer2d";

// Main data type for Drawer2d methods
export type ShapeData = {
    type: 'arc' | 'vector' | 'rect' | 'svg';
    data: ArcData | VectorData | RectData | SVGData;
}

export type Drawer2dData = {
    canvas: {
        context: CanvasRenderingContext2D;
        size: { width: number; height: number; };
        aspectRatio: number;
    }
    shape: ShapeData;
    transform: [number, number, number, number, number, number];
    fill: {
        color: string | null;
    };
    stroke: {
        color: string | null;
        width: number;
    };
    filter: string | null;
}

/** Placeholder class for Drawer2dMethods */
export class Drawer2dMethods {
    private data: Drawer2dData;

    constructor(canvas: { context: CanvasRenderingContext2D; size: { width: number; height: number; }; aspectRatio: number }, shape: ShapeData) {
        this.data = {
            canvas,
            shape,
            transform: [1, 0, 0, 1, 0, 0],
            fill: {
                color: null
            },
            stroke: {
                color: null,
                width: 1
            },
            filter: null
        };
    }


    // Change colors and styles
    /**
     * Sets the fill color for the shape.
     * @param color - The fill color.
     * @returns The Drawer2dMethods instance for chaining.
     */
    fill(color: string): Drawer2dMethods {
        this.data.fill.color = color;
        return this;
    }

    /**
     * Sets the stroke color and width for the shape.
     * @param color - The stroke color.
     * @param width - The stroke width.
     * @returns The Drawer2dMethods instance for chaining.
     */
    stroke(color: string, width: number = 1): Drawer2dMethods {
        this.data.stroke.color = color;
        this.data.stroke.width = width;
        return this;
    }

    /**
     * Set the filter on the shape.
     * @param filter - The filter string.
     */
    filter(filter: string): Drawer2dMethods {
        this.data.filter = filter;
        return this;
    }

    // Transformations
    /**
     * Translates the shape by the specified amounts.
     * @param dx - The translation in the x direction [0, 1].
     * @param dy - The translation in the y direction [0, 1].
     * @returns The Drawer2dMethods instance for chaining.
     */
    translate(dx: number, dy: number): Drawer2dMethods {
        const { width, height } = this.data.canvas.size;
        const [a, b, c, d, e, f] = this.data.transform;
        this.data.transform = [
            a,
            b,
            c,
            d,
            e + dx * width,
            f + dy * height
        ];
        return this;
    }

    /**
     * Scales the shape by the specified factors.
     * @param sx - The scaling factor in the x direction.
     * @param sy - The scaling factor in the y direction.
     * @returns The Drawer2dMethods instance for chaining.
     */
    scale(sx: number, sy?: number): Drawer2dMethods {
        const [a, b, c, d, e, f] = this.data.transform;
        sy = sy ?? sx;
        this.data.transform = [
            a * sx,
            b * sx,
            c * sy,
            d * sy,
            e,
            f
        ];
        return this;
    }

    /**
     * Rotates the shape by the specified angle.
     * @param angle - The rotation angle in radians.
     * @returns The Drawer2dMethods instance for chaining.
     */
    rotate(angle: number): Drawer2dMethods {
        const [a, b, c, d, e, f] = this.data.transform;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.data.transform = [
            a * cos + c * sin,
            b * cos + d * sin,
            -a * sin + c * cos,
            -b * sin + d * cos,
            e,
            f
        ];
        return this;
    }


    // Draw the shape on the canvas
    /**
     * Applies the drawing commands to the canvas context.
     */
    draw() {
        const ctx = this.data.canvas.context;

        // If no fill and no stroke color, no fill and stroke black by default
        if (!this.data.fill.color && !this.data.stroke.color) {
            this.data.stroke.color = 'black';
        }

        // Apply transformations and styles
        ctx.save();
        ctx.transform(...this.data.transform);
        if (this.data.fill.color)
            ctx.fillStyle = this.data.fill.color;
        if (this.data.stroke.color)
            ctx.strokeStyle = this.data.stroke.color;
        if (this.data.filter)
            ctx.filter = this.data.filter;
        ctx.lineWidth = this.data.stroke.width;
        this.drawShape(ctx, this.data.shape);
        ctx.restore();
    }

    /** Draws the specified shape on the canvas context. */
    private drawShape(ctx: CanvasRenderingContext2D, shape: ShapeData) {
        switch (shape.type) {
            case 'arc': {
                const { height } = this.data.canvas.size;
                const width = height;
                const data = shape.data as ArcData;
                ctx.beginPath();
                ctx.ellipse(0, 0, data.radiusX * width, data.radiusY * height, 0, data.startAngle, data.endAngle);
                if (this.data.fill.color) ctx.fill();
                if (this.data.stroke.color) ctx.stroke();
                break;
            }
            case 'rect': {
                const { height } = this.data.canvas.size;
                const width = height;
                const data = shape.data as RectData;
                ctx.beginPath();
                ctx.translate(-data.width * width, -data.height * height);
                ctx.rect(0, 0, data.width * 2.0 * width, data.height * 2.0 * height);
                if (this.data.fill.color) ctx.fill();
                if (this.data.stroke.color) ctx.stroke();
                break;
            }
            case 'svg': {
                const path = new Path2D((shape.data as SVGData).svgString);
                if (this.data.fill.color) ctx.fill(path);
                if (this.data.stroke.color) ctx.stroke(path);
                break;
            }
            case 'vector': {
                const { width, height } = this.data.canvas.size;
                const data = shape.data as VectorData;

                const fromx = data.x1 * width;
                const fromy = data.y1 * height;
                const tox = data.x2 * width;
                const toy = data.y2 * height;

                // Arrow parameters
                const r = data.arrowHeadSize * Math.min(width, height);
                const x_center = tox - (r + 1) * Math.cos(Math.atan2(toy - fromy, tox - fromx));
                const y_center = toy - (r + 1) * Math.sin(Math.atan2(toy - fromy, tox - fromx));

                // Draw line
                ctx.beginPath();
                ctx.moveTo(fromx, fromy);
                ctx.lineTo(tox, toy);
                ctx.stroke();

                // Draw arrow
                ctx.beginPath();
                let angle = Math.atan2(toy - fromy, tox - fromx);
                ctx.moveTo(r * Math.cos(angle) + x_center, r * Math.sin(angle) + y_center);
                angle += (1 / 3) * (2 * Math.PI);
                ctx.lineTo(r * Math.cos(angle) + x_center, r * Math.sin(angle) + y_center);
                angle += (1 / 3) * (2 * Math.PI);
                ctx.lineTo(r * Math.cos(angle) + x_center, r * Math.sin(angle) + y_center);
                ctx.closePath();

                ctx.fill();
                if (this.data.stroke.color) ctx.stroke();

                break;
            }
        }
    }
}