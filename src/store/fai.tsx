import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Process {
	query: string;
	scopes: Array<string>;
	status:
		| "processing"
		| "error"
		| "success"
		| `queue-#${number}`
		| "perform"
		| "action-required";
}

interface FaiStore {
	globalInstruction: string;
	processes: Array<Process>;
	addProcess: (process: Process) => void;
}

export const useFaiStore = create<FaiStore>()(
	immer((set) => ({
		globalInstruction: "",
		processes: [],
		addProcess: (process) =>
			set((state) => {
				state.processes = [...new Set([...state.processes, process])];
			}),
	})),
);
