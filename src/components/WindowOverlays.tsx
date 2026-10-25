import { cn } from "#/lib/utils.ts";
import { useWindowStore } from "#/store/window.tsx";
import React from "react";
import type { WindowInstance } from "../constants/apps";
import Window, { WindowIdContext } from "./Window";
import WindowThumbnail from "./WindowThumbnail";

function WindowOverlays() {
	const { windows } = useWindowStore();

	const visibleWindows = Object.values(windows).filter(
		(win): win is WindowInstance => (win !== undefined) && !win?.shadow,
	);

	const shadowWindows = Object.values(windows).filter(
		(win): win is WindowInstance => (win !== undefined) && (win?.shadow ?? false),
	)

	return (
		<main className="absolute inset-0 overflow-hidden">
			{visibleWindows.map((win) => (
				<Window
					key={win.id}
					win={win}
				/>
			))}
			{shadowWindows.map((win) => {
				const ShadowComponent = win.component
				const id = win.id

				return (
					<WindowIdContext.Provider value={id}  >
						<div
							className={"hidden pointer-events-none fixed -z-50 opacity-0"}
						>
							{React.cloneElement(ShadowComponent as React.ReactElement<any>, { windowId: id })}
						</div>
					</WindowIdContext.Provider>
				)
			})}
		</main>
	);
}

export default WindowOverlays;