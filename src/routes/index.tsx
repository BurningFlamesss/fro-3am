import { useChat } from "@tanstack/ai-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import MediaPlayerEngine from "#/components/MediaPlayerEngine.tsx";
import Screen from "#/components/Screen.tsx";
import Taskbar from "#/components/Taskbar.tsx";
import WindowOverlays from "#/components/WindowOverlays.tsx";
import { terminalExecutions } from "#/constants/fai-tools.tsx";
import { getAIResponse } from "#/server/fai.tsx";
import { type Process, useFaiStore } from "#/store/fai.tsx";
import { usePanelStore } from "#/store/panel.tsx";
import { useSettingStore } from "#/store/setting.tsx";
import { useTerminalStore } from "#/store/terminal.tsx";
import { useWindowStore } from "#/store/window.tsx";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { backgroundImage } = useSettingStore();
	const globalInstruction = useFaiStore((state) => state.globalInstruction);
	const processes = useFaiStore((state) => state.processes);
	const updateProcessStatus = useFaiStore((state) => state.updateProcessStatus);
	const brightness = useSettingStore((state) => state.brightness);
	const backgroundColor = brightness >= 50 ? "white" : "black";
	const opacity = (Math.abs(brightness - 50) / 50) * 0.3;
	const setCommandExpressions = useTerminalStore(state => state.setCommandExpressions)
	const openApp = useWindowStore(state => state.openApp)
	const closeWindow = useWindowStore(state => state.closeWindow)

	const clientTools = useMemo(() => [
		terminalExecutions.client(async ({ commands }) => {
			return new Promise((resolve) => {
				openApp("terminal", undefined, true)

				setCommandExpressions(commands, (outputs) => {
					resolve({
						results: outputs
					})
				})
			})
		})
	], [openApp, setCommandExpressions])


	// It is just a demo of how the execution pipeline of AI opening a shadow app and executing command takes place
	// useEffect(() => {
	// 	let cancelled = false;

	// 	const execute = async () => {
	// 		if (cancelled) return;

	// 		openApp("terminal", undefined, true)
	// 		setCommandExpressions(["task.add Read book"])
	// 	}
	// 	void execute();

	// 	return () => {
	// 		cancelled = true;
	// 	};
	// }, [])

	const { messages, sendMessage, isLoading } = useChat({
		threadId: "something",
		fetcher: (params) => getAIResponse({
			data: {
				messages: params.messages,
				threadId: params.threadId,
				key: "",
				prompt: globalInstruction,
				scopes: ["global"]
			}
		}),
		tools: clientTools
	})

	useEffect(() => {
		console.log("Effect was also called!!!")

		if (isLoading) return

		const nextQueueIndex = processes.findIndex(process => process.status.startsWith("queue-#"))

		if (nextQueueIndex === -1) return

		const process = processes[nextQueueIndex]

		updateProcessStatus(nextQueueIndex, "processing")


		console.log("Inside Effect was also ran", processes)

		sendMessage({
			// metadata: {
			// 	role: "user"
			// },
			content: process.query,
		})
			.then(() => {
				updateProcessStatus(nextQueueIndex, "success")
				const currentWindows = useWindowStore.getState().windows;
				Object.entries(currentWindows).forEach(([key, value]) => {
					if (value?.shadow) {
						closeWindow(value.id)
					}
				})
				usePanelStore.getState().addPanelNotification({
					id: crypto.randomUUID(),
					read: false,
					silent: true,
					title: "Complete the task",
					description: `"${process.query}" is successfully completed.`,
					type: "ai",
					hidden: false,
					at: Date.now()
				})
			})
			.catch(() => {
				updateProcessStatus(nextQueueIndex, "error")
				usePanelStore.getState().addPanelNotification({
					id: crypto.randomUUID(),
					read: false,
					silent: true,
					title: "Error occured",
					description: `"${process.query}" is not completed due to an unknown error.`,
					type: "ai",
					hidden: false,
					at: Date.now()
				})
			})

	}, [isLoading, processes, sendMessage, updateProcessStatus, closeWindow]);

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
