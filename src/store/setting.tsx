import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { targetAssets } from "#/constants/theme.tsx";
import { themeBundle } from "#/constants/theme.tsx";
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
			theme: setThemeOutside("Halloween"),

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
	const foundTheme =
		themeBundle.find((theme) => theme.name === themeName) ?? themeBundle[0];
	const requiredTheme = { ...foundTheme } as Theme;

	foundTheme.targetIncludes.forEach((asset) => {
		const key = asset.name as keyof typeof targetAssets;
		if (asset.additivePath) {
			requiredTheme[key] = foundTheme.target + asset.additivePath;
		} else {
			requiredTheme[key] = asset.absolutePath;
		}
	});

	return requiredTheme;
}
