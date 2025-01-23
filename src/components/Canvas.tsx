"use client";

import { useSocketEvent } from "@/hook/useSocketEvent";
import { socket } from "@/socket";
import { useCallback, useEffect, useRef, useState } from "react";

interface StartPoint {
	x: number;
	y: number;
	type: "start";
}

interface DrawPoint {
	x: number;
	y: number;
	type: "draw";
}

interface StopPoint {
	type: "stop";
}

type Point = StartPoint | DrawPoint | StopPoint;

interface CanvasProps {
	turn: boolean;
}

export default function Canvas({ turn }: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

	const drawPaths = useRef<Point[]>([]);

	const drawPoint = useCallback(
		(point: Point) => {
			if (context) {
				if (point.type === "start") {
					context.beginPath();
					context.moveTo(point.x, point.y);
				} else if (point.type === "draw") {
					context.strokeStyle = "white"; // Set line color to black
					context.lineWidth = 2; // Set line width
					context.lineCap = "round";

					context.lineTo(point.x, point.y);
					context.stroke();
				} else if (point.type === "stop") {
					context.closePath();
				}
			}
		},
		[context]
	);

	// setup context state variable
	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d");
			if (ctx) {
				setContext(ctx);
			}
		}
	}, []);

	useEffect(() => {
		const resizeCanvas = () => {
			if (canvasRef.current) {
				const canvas = canvasRef.current;

				// Set canvas width and height to match the parent container
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;

				// Redraw all the paths to fit the new canvas size
				if (context) {
					context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
					context.save(); // Save current context state

					// Redraw paths with proper scaling based on new canvas size
					drawPaths.current.forEach(drawPoint);

					context.restore(); // Restore context state
				}
			}
		};

		// Initial resize setup
		resizeCanvas();

		// Adjust canvas size on window resize
		window.addEventListener("resize", resizeCanvas);

		// Cleanup on component unmount
		return () => window.removeEventListener("resize", resizeCanvas);
	}, [context, drawPoint]);

	const onDraw = useCallback(
		(point: Point) => {
			drawPaths.current.push(point);
			drawPoint(point);
		},
		[drawPoint]
	);

	// listen to other's drawings
	useSocketEvent("draw", onDraw);

	const startDrawing = (event: React.MouseEvent) => {
		if (context && turn) {
			const { offsetX, offsetY } = event.nativeEvent;
			context.beginPath();
			context.moveTo(offsetX, offsetY);
			setIsDrawing(true);

			drawPaths.current.push({ x: offsetX, y: offsetY, type: "start" });

			// Send drawing start event
			socket.emit("draw", { x: offsetX, y: offsetY, type: "start" });
		}
	};

	const draw = (event: React.MouseEvent) => {
		if (isDrawing && context && turn) {
			const { offsetX, offsetY } = event.nativeEvent;

			// Set initial drawing properties
			context.strokeStyle = "white"; // Set line color to black
			context.lineWidth = 2; // Set line width
			context.lineCap = "round";

			context.lineTo(offsetX, offsetY);
			context.stroke();

			drawPaths.current.push({ x: offsetX, y: offsetY, type: "draw" });

			// Throttle the drawing data to emit every 50ms
			socket.emit("draw", { x: offsetX, y: offsetY, type: "draw" });
		}
	};

	const stopDrawing = () => {
		if (isDrawing && turn) {
			setIsDrawing(false);

			drawPaths.current.push({ type: "stop" });

			// Send drawing stop event
			socket.emit("draw", { type: "stop" });

			if (context) {
				context.closePath();
			}
		}
	};

	return (
		<canvas
			ref={canvasRef}
			onMouseDown={startDrawing}
			onMouseMove={draw}
			onMouseUp={stopDrawing}
			onMouseLeave={stopDrawing}
			className='h-full w-full'
		/>
	);
}
