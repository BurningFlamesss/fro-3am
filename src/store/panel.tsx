import type { id } from "zod/locales";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface PanelNotification {
	id: string;
	type: "ai" | "event";
	silent: boolean;
	title: string;
	description: string;
	at: number;
	read: boolean;
}

interface PanelStore {
	panelNotifications: Array<PanelNotification>;
	sections: Array<unknown>;
	addPanelNotification: (panelNotification: PanelNotification | Omit<PanelNotification, "id">) => void;
	updatePanelNotification: (id: string, panelNotification: Partial<PanelNotification>) => void;
}

export const usePanelStore = create<PanelStore>()(
	immer((set) => ({
		panelNotifications: [],
		sections: [],
		addPanelNotification: (panelNotification) => set((state) => {
			if (panelNotification?.id) {
				state.panelNotifications.push(panelNotification)
			} else {
				const panelNotification2 = {
					id: crypto.randomUUID(),
					...panelNotification
				}
				state.panelNotifications.push(panelNotification2)
			}
		}),
		updatePanelNotification: (id, panelNotification) => set((state) => {
			const targetPanelNotificationIndex = state.panelNotifications.findIndex(panelNotification => id === panelNotification.id)

			state.panelNotifications.splice(targetPanelNotificationIndex, 1, {
				...panelNotification,
				...state.panelNotifications[targetPanelNotificationIndex]
			})
		})
	})),
);
