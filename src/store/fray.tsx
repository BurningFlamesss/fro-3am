import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface FrayInstance {
	id: number;
	name: string;
	rotations: Array<{
		source: string;
		reactions: Array<"change">;
		change: {
			reactionsOnly: boolean;
			frequency: "random" | "instant" | string;
			changeTo: "random" | "next" | "previous" | string;
			at: "mouseenter" | "mouseleave" | "none";
		};
		move: {
			behaviour: "static" | "x" | "y" | "xy" | "follow";
			effect: "glitchy" | "none";
			delay: number;
			speed: number;
		};
	}>;
	position: {
		x: number;
		y: number;
		fixed: boolean;
	};
	size: {
		width: number;
		height: number;
	};
}

const Frays: Array<FrayInstance> = [
	{
		id: 1,
		name: "frokk",
		rotations: [
			{
				source: "/frays/frokk/1.gif",
				reactions: ["change"],
				change: {
					reactionsOnly: true,
					frequency: "instant",
					changeTo: "index-1",
					at: "mouseenter",
				},
				move: {
					behaviour: "static",
					effect: "none",
					delay: 0,
					speed: 0,
				},
			},
			{
				source: "/frays/frokk/2.gif",
				reactions: ["change"],
				change: {
					reactionsOnly: true,
					frequency: "instant",
					changeTo: "index-0",
					at: "mouseleave",
				},
				move: {
					behaviour: "static",
					effect: "none",
					delay: 0,
					speed: 0,
				},
			},
		],
		position: {
			x: 0,
			y: 1000,
			fixed: true,
		},
		size: {
			width: 60,
			height: 60,
		},
	},
	{
		id: 2,
		name: "fhost",
		rotations: [
			{
				source: "/frays/fhost/1.gif",
				reactions: [],
				change: {
					reactionsOnly: false,
					frequency: "random",
					changeTo: "random",
					at: "none",
				},
				move: {
					behaviour: "x",
					effect: "glitchy",
					delay: 2000, // 100ms
					speed: 40, // 40px/s
				},
			},
		],
		position: {
			x: 600,
			y: 540,
			fixed: false,
		},
		size: {
			width: 100,
			height: 90,
		},
	},
];

interface FrayStore {
	frays: Array<FrayInstance>;
	fraysInUse: Array<FrayInstance>;
	updateFrayPosition: (id: number, rectangle: { x: number; y: number }) => void;
}

export const useFrayStore = create<FrayStore>()(
	immer((set) => ({
		frays: Frays,
		fraysInUse: structuredClone(Frays),
		updateFrayPosition: (id, rectangle) =>
			set((state) => {
				const fray = state.fraysInUse.find((frayInUse) => frayInUse.id === id);
				if (fray) {
					fray.position.x = rectangle.x;
					fray.position.y = rectangle.y;
				}
			}),
	})),
);
