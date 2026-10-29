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
		globalInstruction: `You are Fai, an AI of Fro OS designed to complete the required task of a user with the help of provided tools. Use the provided tools to control the os and apps directly when requested.
		
		You may take multiple steps to solve a problem. 
		You should never guess on the information that you can access simply by using a tool.
		`,
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
