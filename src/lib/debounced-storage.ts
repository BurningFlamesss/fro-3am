import type { PersistStorage, StorageValue } from "zustand/middleware";

export function createDebouncedStorage<T>(delay = 1000): PersistStorage<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const getStorage = () => {
		if ( typeof window === "undefined") {
			return null
		}

		return window.localStorage
	}

	return {
		getItem: (name) => {
			const storage = getStorage()
			
			if (!storage) {
				return null
			}

			const value = storage.getItem(name);

			if (value === null) return null;

			try {
				return JSON.parse(value) as StorageValue<T>;
			} catch {
				return null;
			}
		},

		setItem: (name, value) => {
			const storage = getStorage()
			
			if (!storage) {
				return null
			}

			clearTimeout(timer);

			timer = setTimeout(() => {
				storage.setItem(name, JSON.stringify(value));
			}, delay);
		},

		removeItem: (name) => {
			const storage = getStorage()
			
			if (!storage) {
				return null
			}
			
			clearTimeout(timer);

			storage.removeItem(name);
		},
	};
}
