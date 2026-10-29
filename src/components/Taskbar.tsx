import { useEffect, useRef, useState } from "react";
import {
	FaBackwardFast,
	FaBatteryThreeQuarters,
	FaForwardFast,
	FaPause,
	FaPlay,
	FaVolumeHigh,
	FaVolumeXmark,
	FaWifi,
} from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";
import { MdOutlineClose } from "react-icons/md";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { RiUnpinLine } from "react-icons/ri";
import { TbSunHighFilled, TbSunLow } from "react-icons/tb";
import { FILE_ASSOCIATIONS } from "#/lib/fileAssociates.ts";
import {
	cn,
	getDateTime,
	parseFileName,
	searchFileAssociatesThroughExtension,
} from "#/lib/utils.ts";
import { useBrowserStore } from "#/store/browser.tsx";
import { useCalculatorStore } from "#/store/calculator.tsx";
import { useFaiStore } from "#/store/fai.tsx";
import { type FileNode, useFileSystemStore } from "#/store/fs.tsx";
import { useLauncherStore } from "#/store/launcher.tsx";
import { useMusicStore } from "#/store/music.tsx";
import { useNoteStore } from "#/store/note.tsx";
import { useSettingStore } from "#/store/setting.tsx";
import { useTerminalStore } from "#/store/terminal.tsx";
import { findAppWindows, useWindowStore } from "#/store/window.tsx";
import type { AppId, AppInstance, WindowInstance } from "../constants/apps";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
} from "./ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import WindowThumbnail from "./WindowThumbnail";

function MiscellaneousPanel({ onClose }: { onClose: () => void }) {
	const theme = useSettingStore((state) => state.theme);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-[100000002]"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className="absolute bottom-0 right-0 mr-19 mb-20 h-[87%] z-[100000002] flex"
				onClick={(e) => {
					if (e.target === e.currentTarget) onClose();
				}}
			>
				<div
					className={cn("w-75 rounded-2xl overflow-hidden", theme.colourScheme)}
				></div>
			</div>
		</div>
	);
}

function MediaPanel({ onClose }: { onClose: () => void }) {
	const theme = useSettingStore((state) => state.theme);
	const brightness = useSettingStore((state) => state.brightness);
	const setBrightness = useSettingStore((state) => state.setBrightness);
	const [coverImageSource, setCoverImageSource] = useState("");
	const musicStore = useMusicStore();

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [onClose]);

	const track = musicStore.tracks[musicStore.currentIndex];

	useEffect(() => {
		if (track) {
			setCoverImageSource(track.cover);
		} else {
			setCoverImageSource("/apps/Music.svg");
		}
	}, [track?.cover, track?.id]);

	return (
		<div
			className="fixed inset-0 z-[100000002]"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			{track ? (
				<div className="absolute bottom-81 right-0 mr-25 mb-20 h-30 flex">
					<div
						className={cn(
							"w-75 rounded-2xl overflow-hidden p-4 flex flex-col items-center justify-center",
							theme.colourScheme,
						)}
					>
						<main className="flex flex-row-reverse justify-between items-center">
							<div className="h-16 max-w-48 max-h-full aspect-video overflow-hidden border border-white/10">
								<img
									src={coverImageSource}
									alt={track.title}
									className="h-full w-full object-cover"
									onError={() => {
										setCoverImageSource("/music/cover/default.jpg");
									}}
								/>
							</div>

							<div className="px-3 pb-1 text-center">
								<h2 className="text-sm font-semibold truncate">
									{track.title.slice(0, 20)}...
								</h2>
								<p className="text-xs text-white/60 truncate">{track.artist}</p>
							</div>
						</main>
						<div className="flex items-center gap-2">
							<button
								onClick={() => musicStore.previous()}
								className="cursor-pointer text-white/60 hover:text-white"
							>
								<FaBackwardFast size={16} />
							</button>
							<button
								onClick={() => musicStore.togglePlay()}
								className="cursor-pointer rounded-full p-1 bg-white/10 hover:bg-white/20"
							>
								{musicStore.isPlaying ? (
									<FaPause size={16} />
								) : (
									<FaPlay size={16} />
								)}
							</button>
							<button
								onClick={() => musicStore.next()}
								className="cursor-pointer text-white/60 hover:text-white"
							>
								<FaForwardFast size={16} />
							</button>
						</div>
					</div>
				</div>
			) : null}
			<div className="absolute bottom-0 right-0 mr-25 mb-20 h-80 flex">
				<div
					className={cn("w-75 rounded-2xl overflow-hidden", theme.colourScheme)}
				>
					<div className="w-full px-4 py-4 grid grid-cols-3 grid-rows-2">
						{[0, 1, 2, 3, 4, 5].map((ctrlOptions) => {
							return <div key={ctrlOptions}>{ctrlOptions}</div>;
						})}
					</div>
					<div className="w-full px-4 flex flex-col items-center justify-center">
						<div className="w-full flex items-center gap-1">
							<button
								onClick={() => { }}
								className="cursor-pointer text-white/60 hover:text-white"
							>
								{brightness === 0 ? (
									<TbSunLow size={14} />
								) : (
									<TbSunHighFilled size={14} />
								)}
							</button>
							<input
								type="range"
								min="0"
								max="100"
								step="0.05"
								value={brightness}
								onChange={(event) =>
									setBrightness(parseFloat(event.target.value))
								}
								className="w-12 h-1 accent-white/60 cursor-pointer"
							/>
						</div>
						<div className="w-full flex items-center gap-1">
							<button
								onClick={() => musicStore.setMuted(!musicStore.muted)}
								className="cursor-pointer text-white/60 hover:text-white"
							>
								{musicStore.muted || musicStore.volume === 0 ? (
									<FaVolumeXmark size={14} />
								) : (
									<FaVolumeHigh size={14} />
								)}
							</button>
							<input
								type="range"
								min="0"
								max="1"
								step="0.05"
								value={musicStore.muted ? 0 : musicStore.volume}
								onChange={(event) =>
									musicStore.setVolume(parseFloat(event.target.value))
								}
								className="w-12 h-1 accent-white/60 cursor-pointer"
							/>
						</div>
					</div>
					<div className="w-full flex flex-row justify-between px-4">
						<FaBatteryThreeQuarters />
						<img src="/apps/Settings.svg" className="w-4" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}

function FaiPanel({ onClose }: { onClose: () => void }) {
	const theme = useSettingStore((state) => state.theme);
	const addProcess = useFaiStore((state) => state.addProcess);
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [onClose]);

	const handleProcess = async () => {
		console.log("Handle Process was executed!!!")
		addProcess({
			query,
			scopes: ["global"],
			status: "queue-#1"
		});
	};

	return (
		<div
			className="fixed inset-0 z-[100000002]"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className="absolute bottom-0 left-0 ml-25 mb-20 h-[7%] z-[100000002] flex"
				onClick={(e) => {
					if (e.target === e.currentTarget) onClose();
				}}
			>
				<div
					className={cn(
						"w-150 rounded-2xl overflow-hidden flex flex-row justify-center items-center",
						theme.colourScheme,
					)}
				>
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Give instruction to Fai and witness the magic..."
						className="mx-4 w-full h-full bg-transparent text-white outline-none placeholder:text-white/40"
					/>
					<button
						type="button"
						onClick={handleProcess}
						className="mr-4 p-1 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer flex justify-center items-center"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}

function SearchPanel({ onClose }: { onClose: () => void }) {
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { apps, openApp } = useWindowStore();
	const theme = useSettingStore((state) => state.theme);
	const { nodes } = useFileSystemStore();
	const { tabs, selectTab, addTab } = useNoteStore();
	const { launchables, launch } = useLauncherStore();
	const { setCalculatorExpression } = useCalculatorStore();
	const { setCommandExpressions } = useTerminalStore();

	const { addAndUpdateTab } = useBrowserStore();
	const { addTrack } = useMusicStore();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [onClose]);

	const filteredApps = Object.values(apps).filter(
		(app) =>
			app.name.toLowerCase().includes(query.toLowerCase()) ||
			app.title.toLowerCase().includes(query.toLowerCase()),
	);

	const filteredFiles = query
		? Object.values(nodes).filter(
			(node) =>
				node.type === "file" &&
				node.name.toLowerCase().includes(query.toLowerCase()),
		)
		: [];

	const openFile = async (node: FileNode, openAppId?: AppId) => {
		const { name, extension } = parseFileName(node.name);
		if (openAppId) {
			const tab = tabs.find((tab) => tab.id === node.id);
			if (!tab) addTab(name, node.content ?? "", node.id);
			else selectTab(node.id);
			openApp(openAppId);
			return;
		}

		if (node.type === "folder") {
			openApp("file_explorer", undefined, false, { containerId: node.id });
			return;
		}

		const { key } = searchFileAssociatesThroughExtension(extension, {
			...FILE_ASSOCIATIONS,
		});
		switch (key) {
			case "notes": {
				const tab = tabs.find((tab) => tab.id === node.id);
				if (!tab) addTab(name, node.content ?? "", node.id);
				else selectTab(node.id);
				openApp(key);
				break;
			}
			case "calculator": {
				setCalculatorExpression(node.content ?? "");
				openApp(key);
				break;
			}
			case "terminal": {
				const content = node?.content ?? "";
				const queries = content.split("\n").filter(Boolean);
				setCommandExpressions(queries);
				openApp(key);
				break;
			}
			case "browser": {
				const content = node?.content ?? "";
				const queries = content.split("\n").filter(Boolean);
				queries.forEach((q) => addAndUpdateTab({ query: q }));
				openApp(key);
				break;
			}
			case "music": {
				addTrack({
					title: node.name,
					src: node.content ?? "",
					type: "file",
					cover: "/apps/Music.svg",
					artist: "Local File",
				});
				openApp("music");
				break;
			}
			case "app_view":
			case "app_web_view": {
				launch(
					key === "app_view"
						? {
							id: "app_froview",
							name: "App_froview",
							source: {
								type: "fromponent",
								code: function View() {
									return <img src={node.content} alt="" />;
								},
							},
							logo: "/apps/Game.svg",
							showInCollections: true,
						}
						: {
							id: "app_froview",
							name: "App_froview",
							source: { type: "ftml", code: node.content ?? "" },
							logo: "/apps/Game.svg",
							showInCollections: true,
						},
				);
				break;
			}
			default: {
				const launchable = Object.entries(launchables).find(([, value]) =>
					value.extension?.includes(extension),
				) || ["app_not_found", launchables.app_not_found];
				launch(launchable[1]);
			}
		}
	};

	return (
		<div
			className="fixed inset-0 pt-8 pl-[calc(5vw)] pb-[82px] z-[100000002] flex"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className={cn("w-120 rounded-2xl overflow-hidden", theme.colourScheme)}
			>
				<div className="flex items-center px-4 py-3 border-b border-white/10">
					<PiMagnifyingGlassDuotone className="text-white/60 mr-2" />
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Type to search apps, files..."
						className="flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
					/>
					<button
						type="button"
						onClick={onClose}
						className="text-white/40 hover:text-white ml-2 cursor-pointer"
					>
						<MdOutlineClose size={18} />
					</button>
				</div>

				<div className="max-h-full overflow-y-auto p-2">
					{!query && (
						<p className="text-white/40 text-center text-sm py-4">
							Start typing to search
						</p>
					)}

					{query && filteredApps.length === 0 && filteredFiles.length === 0 && (
						<p className="text-white/40 text-center text-sm py-4">
							No results found
						</p>
					)}

					{filteredApps.length > 0 && (
						<div className="mb-2">
							<h3 className="text-xs font-semibold text-white/50 uppercase mb-1 px-2">
								Apps
							</h3>
							{filteredApps.map((app) => (
								<button
									type="button"
									key={app.id}
									onClick={() => {
										openApp(app.id);
										onClose();
									}}
									className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-white/10 text-left text-sm text-white cursor-pointer"
								>
									<img src={app.logo} alt="" className="w-5 h-5" />
									{app.name}
								</button>
							))}
						</div>
					)}

					{filteredFiles.length > 0 && (
						<div>
							<h3 className="text-xs font-semibold text-white/50 uppercase mb-1 px-2">
								Files
							</h3>
							{filteredFiles.map((node) => (
								<button
									type="button"
									key={node.id}
									onClick={() => {
										openFile(node);
										onClose();
									}}
									className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-white/10 text-left text-sm text-white cursor-pointer"
								>
									<img
										src={
											node.type === "folder"
												? "/general/fs/Folder.svg"
												: `/general/fs/File-${searchFileAssociatesThroughExtension(parseFileName(node.name).extension).file_image}.svg`
										}
										alt=""
										className="w-5 h-5"
									/>
									<span className="truncate">{node.name}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function Taskbar() {
	const {
		apps,
		windows,
		openApp,
		focusWindow,
		minimizeWindow,
		closeWindow,
		unpinApp,
	} = useWindowStore();
	const theme = useSettingStore((state) => state.theme);
	const [dateTimeData, setDateTimeData] = useState(() => getDateTime());
	const [searchPanelTriggered, setSearchPanelTriggered] =
		useState<boolean>(false);
	const [faiPanelTriggered, setFaiPanelTriggered] = useState<boolean>(false);
	const [mediaPanelTriggered, setMediaPanelTriggered] =
		useState<boolean>(false);
	const [miscellaneousPanelTriggered, setMiscellaneousPanelTriggered] =
		useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const timer = setInterval(() => {
			setDateTimeData(getDateTime());
		}, 60_000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = "move";
			}
		};
		document.body.addEventListener("dragover", handleDragOver);
		return () => document.body.removeEventListener("dragover", handleDragOver);
	}, []);

	const toggleApp = (app: AppInstance) => {
		const allAppWindows = findAppWindows(windows, app.id);
		const appWindows = allAppWindows.filter(w => !w?.shadow)

		if (appWindows.length === 0) {
			openApp(app.id);
			return;
		}

		if (appWindows.length === 1 && appWindows[0]) {
			const window = appWindows[0];

			if (window.minimized) {
				focusWindow(window.id);
				return;
			}

			const topWindow = Object.values(windows)
				.filter(
					(win): win is WindowInstance => win !== undefined && !win.minimized,
				)
				.reduce(
					(top, win) => (win.zIndex > (top?.zIndex ?? -1) ? win : top),
					null as WindowInstance | null,
				);

			if (topWindow && topWindow.id === window.id) {
				minimizeWindow(window.id);
			} else {
				focusWindow(window.id);
			}
		} else {
			// Handle operation to show multiple options to open a window
			// const visible = appWindows.filter(
			// 	(win): win is WindowInstance => win !== undefined && !win.minimized,
			// );
			// if (visible.length > 0) {
			// 	const top = visible.sort((a, b) => b.zIndex - a.zIndex)[0];
			// 	focusWindow(top.id);
			// } else {
			// 	if (appWindows[0]) {
			// 		focusWindow(appWindows[0].id);
			// 	}
			// }
		}
	};

	return (
		<>
			{searchPanelTriggered && (
				<SearchPanel onClose={() => setSearchPanelTriggered(false)} />
			)}
			{faiPanelTriggered && (
				<FaiPanel onClose={() => setFaiPanelTriggered(false)} />
			)}
			{mediaPanelTriggered && (
				<MediaPanel onClose={() => setMediaPanelTriggered(false)} />
			)}
			{miscellaneousPanelTriggered && (
				<MiscellaneousPanel
					onClose={() => setMiscellaneousPanelTriggered(false)}
				/>
			)}
			<footer
				className={cn(
					"text-white h-16 w-[90dvw] flex items-center justify-between px-4 absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl z-100000000",
					theme.colourScheme,
				)}
			>
				<section className="flex items-center gap-4 h-full">
					<button
						type="button"
						onClick={() => {
							Object.entries(windows).forEach(([key, value]) => {
								if (value) {
									minimizeWindow(value.id);
								}
							});
						}}
						className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer"
					>
						<img
							className="w-8 h-8 object-contain"
							src={theme.logo}
							alt="Logo"
						/>
					</button>

					<div
						onClick={() => setSearchPanelTriggered((prev) => !prev)}
						className="relative flex items-center"
					>
						<PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search"
							className="w-52 h-9 pl-10 pr-4 rounded-full bg-white/10 border border-border/30 text-sm text-white/80 placeholder:text-white/50 hover:bg-white/20 focus:outline-none focus:bg-white/20 transition-colors duration-150"
						/>
					</div>

					<button
						type="button"
						onClick={() => setFaiPanelTriggered((prev) => !prev)}
						className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer"
					>
						<img
							className="w-8 h-8 object-contain"
							src={"/fai.png"}
							alt="Logo"
						/>
					</button>
				</section>

				<section className="flex items-center gap-1">
					{Object.entries(apps).map(([key, app]) => {
						const allWin = findAppWindows(windows, app.id);
						const win = allWin.filter(w => !w?.shadow)
						const activeWin = win.filter((w) => !w?.minimized);

						if (!win.length && !activeWin.length && !app.isPinned) {
							return null;
						}

						return (
							<ContextMenu key={key}>
								<ContextMenuTrigger>
									<Tooltip>
										<TooltipTrigger
											type="button"
											onClick={() => toggleApp(app)}
											className={cn(
												"group p-2 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer",
												win.length ? "bg-white/5 " : "",
											)}
										>
											<img
												className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100"
												src={app.logo}
												alt={app.name}
												draggable="true"
												onDragStart={(e) => {
													e.dataTransfer.setData("text/plain", app.id);
													e.dataTransfer.effectAllowed = "move";
													const dragImg = new Image();
													dragImg.src = app.logo;
													e.dataTransfer.setDragImage(dragImg, 12, 12);
												}}
												onDragEnd={(e) => {
													if (e.dataTransfer.dropEffect === "move") {
														const winWidth = 600;
														const winHeight = 400;
														const x = Math.max(
															0,
															Math.min(
																e.clientX - winWidth / 2,
																window.innerWidth - winWidth,
															),
														);
														const y = Math.max(
															0,
															Math.min(
																e.clientY - winHeight / 2,
																window.innerHeight - winHeight,
															),
														);
														openApp(app.id, {
															x,
															y,
															width: winWidth,
															height: winHeight,
														});
													}
												}}
											/>
										</TooltipTrigger>
										<TooltipContent
											className={cn(
												"z-100000001",
												win.length
													? "translate-y-[calc(-10%-2px)]"
													: "px-3 py-1.5",
											)}
										>
											{win.length ? (
												<div className="flex gap-2 p-2 max-w-90 overflow-x-auto no-scrollbar">
													{win.map(
														(w) => w && <WindowThumbnail key={w.id} win={w} />,
													)}
												</div>
											) : (
												<p>{app.name}</p>
											)}
										</TooltipContent>
									</Tooltip>
								</ContextMenuTrigger>
								<ContextMenuContent className="z-100000002 -translate-x-1/2 translate-y-[-78%]">
									<ContextMenuGroup>
										{app.singleInstance ? null : (
											<ContextMenuItem onClick={() => openApp(app.id)}>
												<img
													draggable={false}
													className="h-4 w-4"
													src={app.logo}
													alt=""
												/>{" "}
												New Window
											</ContextMenuItem>
										)}
										<ContextMenuItem onClick={() => unpinApp(app.id)}>
											<RiUnpinLine className="text-white" />
											Unpin from taskbar
										</ContextMenuItem>
										<ContextMenuItem
											onClick={() => win.map((w) => w && closeWindow(w.id))}
										>
											<MdOutlineClose className="text-destructive" />
											Close all windows
										</ContextMenuItem>
									</ContextMenuGroup>
								</ContextMenuContent>
							</ContextMenu>
						);
					})}
				</section>

				<section className="flex items-center gap-5 h-full">
					<div
						onClick={() => setMediaPanelTriggered((prev) => !prev)}
						className="flex items-center gap-3 text-white text-lg px-2 py-4 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer"
					>
						<Tooltip>
							<TooltipTrigger className="cursor-default">
								<FaWifi className="" />
							</TooltipTrigger>
							<TooltipContent className="px-3 py-1.5 my-4">
								Wi-Fi
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger className="cursor-default">
								<HiSpeakerWave className="" />
							</TooltipTrigger>
							<TooltipContent className="px-3 py-1.5 my-4">
								Volume
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger className="cursor-default">
								<FaBatteryThreeQuarters className="" />
							</TooltipTrigger>
							<TooltipContent className="px-3 py-1.5 my-4">
								Battery
							</TooltipContent>
						</Tooltip>
					</div>

					<div
						onClick={() => setMiscellaneousPanelTriggered((prev) => !prev)}
						className="flex items-center gap-3 px-2 py-2 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer"
					>
						<div className="flex flex-col items-end leading-tight">
							<p className="text-sm font-semibold text-white">
								{dateTimeData.time}
							</p>
							<p className="text-xs text-white/90 font-medium">
								{dateTimeData.date}
							</p>
						</div>
					</div>
				</section>
			</footer>
		</>
	);
}

export default Taskbar;
