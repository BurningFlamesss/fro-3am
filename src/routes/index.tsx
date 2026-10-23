import { createFileRoute } from "@tanstack/react-router";
import MediaPlayerEngine from "#/components/MediaPlayerEngine.tsx";
import Screen from "#/components/Screen.tsx";
import Taskbar from "#/components/Taskbar.tsx";
import WindowOverlays from "#/components/WindowOverlays.tsx";
import { useFaiStore } from "#/store/fai.tsx";
import { useSettingStore } from "#/store/setting.tsx";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { backgroundImage } = useSettingStore();
	const processes = useFaiStore((state) => state.processes);
	const brightness = useSettingStore((state) => state.brightness);
	const backgroundColor = brightness >= 50 ? "white" : "black";
	const opacity = (Math.abs(brightness - 50) / 50) * 0.3;
	return (
		<div
			className="os-container"
			style={{
				backgroundImage: `url(${backgroundImage.url})`,
				backgroundPosition: backgroundImage.position,
			}}
		>
			<Screen />
			<WindowOverlays />
			<Taskbar />
			<MediaPlayerEngine />

			<div
				className="fixed inset-0 pointer-events-none transition-opacity duration-100 z-[10000000009]"
				style={{
					backgroundColor,
					opacity,
					mixBlendMode: brightness < 50 ? "normal" : "screen",
				}}
			/>
		</div>
	);
}
