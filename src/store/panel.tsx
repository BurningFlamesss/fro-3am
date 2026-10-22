import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface PanelStore {
    sections: Array<unknown>;
}

export const usePanelStore = create<PanelStore>()(
	immer((set) => ({
		sections: []
	})),
);
