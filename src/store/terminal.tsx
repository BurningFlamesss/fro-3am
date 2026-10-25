import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TerminalStore {
	commandExpressions: Array<string>;
	setCommandExpressions: (commandExpressions: Array<string>, onComplete?: (outputs: Array<string>) => void) => void;
	onComplete?: (outputs: Array<string>) => void;
	clearCommandExpressions: () => void;
}

export const useTerminalStore = create<TerminalStore>()(
	immer((set) => ({
		commandExpressions: [""],
		setCommandExpressions: (commandExpressions: Array<string>, onComplete) =>
			set((state) => {
				state.commandExpressions = commandExpressions;
				state.onComplete = onComplete
			}),
		onComplete: undefined,
		clearCommandExpressions: () => set((state) => {
			state.commandExpressions = []
			state.onComplete = undefined
		})
	})),
);
