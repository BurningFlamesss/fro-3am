import { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { cn } from "#/lib/utils.ts";
import { type FrayInstance, useFrayStore } from "#/store/fray.tsx";

const clampPosition = (
	x: number,
	y: number,
	containerW: number,
	containerH: number,
	width: number,
	height: number,
) => {
	const maxX = Math.max(0, containerW - width);
	const minX = 0;
	const maxY = Math.max(containerH - height);
	const minY = 0;
	return {
		x: Math.min(maxX, Math.max(minX, x)),
		y: Math.min(maxY, Math.max(minY, y)),
	};
};

const getCanvasRect = (): DOMRect | null => {
	const el = document.getElementById("fray-area");
	return el ? el.getBoundingClientRect() : null;
};

export default function FrayRenderer({ fray }: { fray: FrayInstance }) {
	const updateFrayPosition = useFrayStore((state) => state.updateFrayPosition);
	const { id, name, position, rotations, size } = fray;
	const [rotationIndex, setRotationIndex] = useState(0);
	const [currentRotation, setCurrentRotation] = useState(
		rotations[rotationIndex],
	);
	const rndRef = useRef<Rnd>(null);

	const lastClampedPos = useRef({ x: position.x, y: position.y });

	const handleDrag = useCallback(
		(_e: any, d: { x: number; y: number }) => {
			const container = getCanvasRect();
			if (!container) return;
			const clamped = clampPosition(
				d.x,
				d.y,
				container.width,
				container.height,
				size.width,
				size.height,
			);
			if (
				clamped.x !== lastClampedPos.current.x ||
				clamped.y !== lastClampedPos.current.y
			) {
				lastClampedPos.current = clamped;
				rndRef.current?.updatePosition(clamped);
			}
		},
		[size],
	);

	const handleDragStop = useCallback(
		(_e: any, d: { x: number; y: number }) => {
			const container = getCanvasRect();
			if (!container) return;
			const clamped = clampPosition(
				d.x,
				d.y,
				container.width,
				container.height,
				size.width,
				size.height,
			);
			updateFrayPosition(id, {
				x: clamped.x,
				y: clamped.y,
			});
			lastClampedPos.current = clamped;
		},
		[id, updateFrayPosition, size],
	);

	useEffect(() => {
		const sync = () =>
			handleDragStop(null, {
				x: position.x,
				y: position.y,
			});

		sync();

		window.addEventListener("resize", sync);
		return () => window.removeEventListener("resize", sync);
	}, [handleDragStop, position.x, position.y]);

	const handleRotation = (event: "mouseenter" | "mouseleave") => {
		if (
			!currentRotation.reactions.includes("change") ||
			currentRotation.change.at !== event
		)
			return;

		const target = currentRotation.change.changeTo;
		let newRotationIndex: number = rotationIndex;

		switch (target) {
			case "random":
				newRotationIndex = Math.floor(Math.random() * rotations.length);
				break;
			case "next":
				newRotationIndex = (rotationIndex + 1) % rotations.length;
				break;
			case "previous":
				newRotationIndex =
					(rotationIndex - 1 + rotations.length) % rotations.length;
				break;

			default:
				if (target.startsWith("index-")) {
					const index = +target.replaceAll("index-", "") as number;
					if (!Number.isNaN(index) && rotations?.[index]) {
						newRotationIndex = index;
					}
				}

				break;
		}

		setRotationIndex(newRotationIndex);
		setCurrentRotation(rotations[newRotationIndex]);
	};

	return (
		<>
			<Rnd
				ref={rndRef}
				dragHandleClassName="fray-drag-handle"
				position={{ x: position.x, y: position.y }}
				size={{ width: size.width ?? 0, height: size.height ?? 0 }}
				disableDragging={position.fixed}
				enableResizing={false}
				bounds={document.getElementById("fray-area") ? "parent" : undefined}
				onDrag={handleDrag}
				onDragStop={handleDragStop}
				className={cn("absolute overflow-hidden group pointer-events-auto")}
			>
				<div
					onMouseEnter={() => handleRotation("mouseenter")}
					onMouseLeave={() => handleRotation("mouseleave")}
					className={cn(
						"fray-drag-handle flex items-center justify-between",
						"select-none cursor-grab active:cursor-grabbing",
						position.fixed && "cursor-auto active:cursor-auto",
					)}
				>
					<img
						className="select-none"
						src={currentRotation.source}
						alt=""
						draggable={false}
					/>
				</div>
			</Rnd>
			<div></div>
		</>
	);
}
