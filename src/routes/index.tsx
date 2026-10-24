import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import MediaPlayerEngine from "#/components/MediaPlayerEngine.tsx";
import Screen from "#/components/Screen.tsx";
import Taskbar from "#/components/Taskbar.tsx";
import WindowOverlays from "#/components/WindowOverlays.tsx";
import { getAIResponse } from "#/server/fai.tsx";
import { type Process, useFaiStore } from "#/store/fai.tsx";
import { useSettingStore } from "#/store/setting.tsx";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { backgroundImage } = useSettingStore();
	const globalInstruction = useFaiStore((state) => state.globalInstruction);
	const processes = useFaiStore((state) => state.processes);
	const brightness = useSettingStore((state) => state.brightness);
	const backgroundColor = brightness >= 50 ? "white" : "black";
	const opacity = (Math.abs(brightness - 50) / 50) * 0.3;

	const handleProcess = async (process: Process, queueIndex) => {
		getAIResponse({
			data: {
				key: "",
				prompt: `${globalInstruction}
				
				${process.query}
				`,
				scopes: process.scopes,
			},
		});
	};

	useEffect(() => {
		processes.forEach((process) => {
			if (!process.status.includes("#")) return;

			const queueIndex = +process.status.replace("queue-#", "") as number;

			if (!Number.isNaN(queueIndex)) {
				handleProcess(process, queueIndex);
			}
		});
	}, []);

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
