import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { targetAssets, themeBundle } from "#/constants/theme.tsx";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";

type Theme = (typeof themeBundle)[0] &
	Record<keyof typeof targetAssets, string>;

interface SettingStore {
	backgroundImage: Record<"url" | "position", string>;
	location: string;
	theme: Theme;
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
			theme: setThemeOutside("Default"),

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
					state.theme = setThemeOutside(themeName);
				}),
		})),
		{
			name: "frottings-storage",
			storage: createDebouncedStorage(1000),
		},
	),
);

function setThemeOutside(themeName: string): Theme {
	let foundTheme = themeBundle.find((theme) => theme.name === themeName) ?? themeBundle[0];
	let requiredTheme = { ...foundTheme } as Theme;

	foundTheme.targetIncludes.forEach((asset) => {
				if (asset.additivePath) {
					requiredTheme[asset.name] = foundTheme.target + asset.additivePath;
				} else {
					requiredTheme[asset.name] = asset.absolutePath;
				}
			}
	)

	return requiredTheme;
}
