import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface FaiStore {
	processes: Array<unknown>;
}

export const useFaiStore = create<FaiStore>()(
	immer((set) => ({
		processes: [],
	})),
);
