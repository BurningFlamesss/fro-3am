import { num } from "mathjs";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const Frays = [
	{
		id: 1,
		name: "frokk",
		rotations: ["/frays/frokk/1.gif"],
		position: {
			x: 45,
			y: 45,
			fixed: false,
		},
		size: {
			width: 60,
			height: 60,
		},
		reactions: ["change"],
		change: {
			reactionsOnly: true,
		},
	},
	{
		id: 2,
		name: "fhost",
		rotations: ["/frays/fhost/1.gif"],
		position: {
			x: 45,
			y: 45,
			fixed: false,
		},
		size: {
			width: 60,
			height: 60,
		},
		reactions: ["follow"],
		change: {
			reactionsOnly: false,
			frequency: "random",
		},
	},
];

interface FrayStore {
	frays: Array<string>;
	fraysInUse: Array<unknown>;
}

export const useFrayStore = create<FrayStore>()(
	immer((set) => ({
		frays: [],
		fraysInUse: [],
	})),
);
