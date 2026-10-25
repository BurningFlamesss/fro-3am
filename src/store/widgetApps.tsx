import type { WidgetId } from "#/constants/widgets.tsx";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface WidgetAppsStore {
    widgetStates: Record<WidgetId, Record<string, unknown>>;
    updateWidgetState: (widgetId: WidgetId, fields: Record<string, unknown>) => void;
}

export const useWidgetAppsStore = create<WidgetAppsStore>()(
    immer((set) => ({
        widgetStates: {},
        updateWidgetState: (widgetId, fields) => set((state) => {
            state.widgetStates[widgetId] = { ...state.widgetStates[widgetId], ...fields }
        }),
    })),
);
