import { useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { cn } from "#/lib/utils.ts";
import { type FrayInstance, useFrayStore } from "#/store/fray.tsx";

const clampPosition = (
	x: number,
	y: number,
	containerW: number,
	containerH: number,
) => {
	const maxX = containerW;
	const minX = 0;
	const maxY = containerH;
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
	const rndRef = useRef<Rnd>(null);
	const { id, name, position, rotations, size } = fray;

	const lastClampedPos = useRef({ x: position.x, y: position.y });

	const handleDrag = useCallback((_e: any, d: { x: number; y: number }) => {
		const container = getCanvasRect();
		if (!container) return;
		const clamped = clampPosition(d.x, d.y, container.width, container.height);
		if (
			clamped.x !== lastClampedPos.current.x ||
			clamped.y !== lastClampedPos.current.y
		) {
			lastClampedPos.current = clamped;
			rndRef.current?.updatePosition(clamped);
		}
	}, []);

	const handleDragStop = useCallback(
		(_e: any, d: { x: number; y: number }) => {
			const container = getCanvasRect();
			if (!container) return;
			const clamped = clampPosition(
				d.x,
				d.y,
				container.width,
				container.height,
			);
			updateFrayPosition(id, {
				x: clamped.x,
				y: clamped.y,
			});
			lastClampedPos.current = clamped;
		},
		[id, updateFrayPosition],
	);

	return (
		<>
			<Rnd
				ref={rndRef}
				dragHandleClassName="fray-drag-handle"
				position={{ x: position.x, y: position.y }}
				size={{ width: size.width ?? 0, height: size.height ?? 0 }}
				disableDragging={position.fixed}
				bounds={document.getElementById("fray-area") ? "parent" : undefined}
				onDrag={handleDrag}
				onDragStop={handleDragStop}
				className={cn("absolute overflow-hidden group pointer-events-auto")}
			>
				<div
					className={cn(
						"fray-drag-handle flex items-center justify-between h-8",
						"select-none cursor-grab active:cursor-grabbing",
						position.fixed && "cursor-auto active:cursor-auto",
					)}
				>
					<img className="select-none" src={rotations[0].source} alt="" draggable={false} />
				</div>
			</Rnd>
			<div></div>
		</>
	);
}
