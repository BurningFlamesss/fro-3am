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
	updateProcessStatus: (index: number, status: Process["status"]) => void;
}

export const useFaiStore = create<FaiStore>()(
	immer((set) => ({
		globalInstruction: "Use the provided tools to controls the os and apps directly when requested.",
		processes: [],
		addProcess: (process) =>
			set((state) => {
				state.processes = [...new Set([...state.processes, process])];
			}),
		updateProcessStatus: (index, status) => set((state) => {
			state.processes[index].status = status
		})
	})),
);
