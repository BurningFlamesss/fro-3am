import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface FrayInstance {
	id: number;
	name: string;
	rotations: Array<{
		source: string;
		reactions: Array<"change" | "follow">;
		change: {
			reactionsOnly: boolean;
			frequency: "random" | string;
			changeTo: "random" | "next" | "previous" | string;
		};
		follow: {
			behaviour: "glitchy" | "unmovable";
			delay: string;
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
					frequency: "random",
					changeTo: "next",
				},
				follow: {
					behaviour: "unmovable",
					delay: "0ms",
					speed: 0,
				},
			},
		],
		position: {
			x: 45,
			y: 45,
			fixed: false,
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
				reactions: ["follow"],
				change: {
					reactionsOnly: false,
					frequency: "random",
					changeTo: "random",
				},
				follow: {
					behaviour: "glitchy",
					delay: "100ms",
					speed: 4, // 4px/s
				},
			},
		],
		position: {
			x: 45,
			y: 45,
			fixed: false,
		},
		size: {
			width: 60,
			height: 60,
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
		fraysInUse: Frays,
		updateFrayPosition: (id, rectangle) =>
			set((state) => {
				const fray = state.fraysInUse[id - 1]; // I know it needs to be robust but it works for now
				if (fray) {
					fray.position.x = rectangle.x;
					fray.position.y = rectangle.y;
				}
			}),
	})),
);
