import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface FaiStore {
	processes: Array<unknown>;
	addProcess: (process: unknown) => void;
}

export const useFaiStore = create<FaiStore>()(
	immer((set) => ({
		processes: [],
		addProcess: (process) =>
			set((state) => {
				state.processes = [...new Set([...state.processes, process])]
			}),
	})),
);
