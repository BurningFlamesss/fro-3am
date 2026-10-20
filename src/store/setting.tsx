import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";
import { themeBundle } from "#/constants/theme.tsx";

interface SettingStore {
	backgroundImage: Record<"url" | "position", string>;
	location: string;
	theme: unknown;
	setBackgroundImage: (imageUrl: string, position: string) => void;
	setLocation: (location: string) => void;
	setTheme: (themeName: string) => void;
}

export const useSettingStore = create<SettingStore>()(
	persist(
		immer((set) => ({
			backgroundImage: {
				url: "/backgrounds/halloween.gif",
				position: "bottom",
			},
			location: "Butwal",
			theme: "Halloween",

			setBackgroundImage: (imageUrl, position) =>
				set((state) => {
					state.backgroundImage.url = imageUrl;
					state.backgroundImage.position = position;
				}),

			setLocation: (location) =>
				set((state) => {
					const trimmed = location.trim();
					if (!trimmed) {
						return;
					}
					state.location = trimmed;
				}),

			setTheme: (themeName) =>
				set((state) => {
					let hasFound: boolean = false;
					themeBundle.forEach((theme) => {
						if (theme.name === themeName) {
							state.theme = theme;
							hasFound = true;
						}
					})

					if (!hasFound) {
						state.theme = themeBundle[0];
					}
				}),
		})),
		{
			name: "frottings-storage",
			storage: createDebouncedStorage(1000),
		},
	),
);
