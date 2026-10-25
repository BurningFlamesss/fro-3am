import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface PanelStore {
	notifications: Array<unknown>;
    sections: Array<unknown>;
}

export const usePanelStore = create<PanelStore>()(
	immer((set) => ({
		notifications: [],
		sections: []
	})),
);
