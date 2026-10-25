import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TerminalStore {
	commandExpressions: Array<string>;
	setCommandExpressions: (commandExpressions: Array<string>) => void;
}

export const useTerminalStore = create<TerminalStore>()(
	immer((set) => ({
		commandExpressions: [""],
		setCommandExpressions: (commandExpressions: Array<string>) =>
			set((state) => {
				state.commandExpressions = commandExpressions;
			}),
	})),
);
