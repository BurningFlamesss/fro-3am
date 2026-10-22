import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TerminalStore {
	commandExpressions: Array<string>;
	setCommandExpression: (commandExpressions: Array<string>) => void;
}

export const useTerminalStore = create<TerminalStore>()(
	immer((set) => ({
		commandExpressions: [""],
		setCommandExpression: (commandExpressions: Array<string>) =>
			set((state) => {
				state.commandExpressions = commandExpressions;
			}),
	})),
);
