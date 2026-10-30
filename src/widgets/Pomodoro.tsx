import { useEffect, useRef, useState } from "react";
import { COMPLETED_MARKER, cn, decodeHiddenInformation, disguishHiddenInformation, formatTime, INCOMPLETE_MARKER, TASK_TAB_ID } from "#/lib/utils.ts";
import { useNoteStore } from "#/store/note.tsx";
import { useSettingStore } from "#/store/setting.tsx";
import breakGif from "../../public/widgets/pomodoro/break.gif";
import breakBtn from "../../public/widgets/pomodoro/break.png";
import breakBtnClicked from "../../public/widgets/pomodoro/break-clicked.png";
import frokSound from "../../public/widgets/pomodoro/frok.mp3";
import idleGif from "../../public/widgets/pomodoro/idle.gif";
import playImg from "../../public/widgets/pomodoro/play.png";
import resetImg from "../../public/widgets/pomodoro/reset.png";
import workGif from "../../public/widgets/pomodoro/work.gif";
import workBtn from "../../public/widgets/pomodoro/work.png";
import workBtnClicked from "../../public/widgets/pomodoro/work-clicked.png";

const cheerMessages = [
	"Stay Frokused",
	"You can do it!",
	"Fro believe in you",
	"You're amazing",
	"Keep Froking",
];

const breakMessages = [
	"Stay Hydrated!",
	"Eat some frogs?",
	"Stretch you arms",
	"Touch some grass",
	"Walk 100 meters",
];

const DEFAULT_WORK_TIME = 25 * 60
const DEFAULT_BREAK_TIME = 5 * 60

function Pomodoro() {
	const theme = useSettingStore((state) => state.theme)
	const taskTab = useNoteStore(state => state.tabs.find(tab => tab.id === TASK_TAB_ID))
	const content = taskTab?.content ?? "";
	const eligibleTaskItems = content
		.split("\n")
		.map((line) => {
			let trimmed = line.trim();
			let linked: string = ""
			let priority: number = 0

			const hiddenText = decodeHiddenInformation(trimmed)

			if (hiddenText) {
				const segments = hiddenText.split(",").map(segment => segment.trim())
				linked = (segments.find(segment => segment.startsWith("linked-to=")) ?? "").replace("linked-to=", "")
				const priorityString = (segments.find(segment => segment.startsWith("priority=")) ?? "").replace("priority=", "")

				const parsed = parseInt(priorityString, 10)
				priority = Number.isNaN(parsed) ? 0 : parsed
			}

			if (trimmed.startsWith(COMPLETED_MARKER)) {
				trimmed = trimmed.slice(COMPLETED_MARKER.length).trim()
			}
			if (trimmed.startsWith(INCOMPLETE_MARKER)) {
				trimmed = trimmed.slice(INCOMPLETE_MARKER.length).trim()
			}

			return { text: trimmed, completed: false, linked, priority };
		})
		.filter((item) => item?.linked)
		.sort((a, b) => a.priority - b.priority);

	console.log("Eligible task items: ", eligibleTaskItems)

	const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_WORK_TIME);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [workingFor, setWorkingFor] = useState<string>("");
	const [isBreak, setIsBreak] = useState<boolean>(false);
	const [encouragement, setEncouragement] = useState<string>("");

	const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
	const [workButtonImage, setWorkButtonImage] = useState(workBtn);
	const [image, setImage] = useState(playImg);
	const [gifImage, setGifImage] = useState(idleGif);

	const frokAudioRef = useRef<HTMLAudioElement | null>(null);
	const endTimeRef = useRef<number>(0);
	const animationFrameRef = useRef<number>(0);
	const totalDurationRef = useRef<number>(DEFAULT_WORK_TIME);

	useEffect(() => {
		frokAudioRef.current = new Audio(frokSound);

		return () => {
			if (frokAudioRef.current) {
				frokAudioRef.current.pause();
				frokAudioRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		let messageInterval: NodeJS.Timeout;

		if (isRunning) {
			const messages = isBreak ? breakMessages : cheerMessages;
			setEncouragement(messages[0]);
			let index = 1;

			messageInterval = setInterval(() => {
				setEncouragement(messages[index]);
				index = (index + 1) % messages.length;
			}, 4000);
		} else {
			setEncouragement("");
		}

		return () => clearInterval(messageInterval);
	}, [isRunning, isBreak]);

	useEffect(() => {
		if (!isRunning) {
			cancelAnimationFrame(animationFrameRef.current);
			return;
		}

		const updateTimer = () => {
			const now = Date.now();
			const remaining = Math.max(
				0,
				Math.ceil((endTimeRef.current - now) / 1000),
			);

			setTimeLeft((prev) => {
				if (remaining !== prev) return remaining;

				return prev;
			});

			if (remaining > 0) {
				animationFrameRef.current = requestAnimationFrame(updateTimer);
			} else {
				setIsRunning(false);
				setImage(playImg);
				setGifImage(idleGif);
				setTimeLeft(totalDurationRef.current);

				frokAudioRef.current?.play().catch(() => { });
			}
		};

		const remainingSeconds = timeLeft;

		endTimeRef.current = Date.now() + remainingSeconds * 1000;
		animationFrameRef.current = requestAnimationFrame(updateTimer);

		return () => cancelAnimationFrame(animationFrameRef.current);
	}, [isRunning]);

	const switchMode = (breakMode: boolean) => {
		setIsBreak(breakMode);
		setIsRunning(false);

		setBreakButtonImage(breakMode ? breakBtnClicked : breakBtn);
		setWorkButtonImage(breakMode ? workBtn : workBtnClicked);
		setGifImage(idleGif);
		setImage(playImg);

		const newDuration = breakMode ? DEFAULT_BREAK_TIME : DEFAULT_WORK_TIME;
		totalDurationRef.current = newDuration;
		setTimeLeft(newDuration);
	};

	const handleClick = () => {
		if (!isRunning) {
			setIsRunning(true);
			setGifImage(isBreak ? breakGif : workGif);
			setImage(resetImg);
		} else {
			setIsRunning(false);
			setGifImage(idleGif);
			setImage(playImg);
		}
	};

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const timeString = event.target.value
		const timeHand = timeString.split(":")
		const [minuteHand, secondHand] = timeHand
		const [parsedMinute, parsedSecond] = [parseInt(minuteHand, 10), parseInt(secondHand, 10)]
		const [minute, second] = [Number.isNaN(parsedMinute) ? isBreak ? 5 : 25 : parsedMinute, Number.isNaN(parsedSecond) ? 0 : parsedSecond]
		const newDuration = (minute * 60) + second;
		totalDurationRef.current = newDuration;
		setTimeLeft(newDuration);
	}

	return (
		<main
			className={cn("w-full min-h-full flex items-center justify-center box-border text-center retro-font", theme.colourScheme, "border-0")}
			style={{
				backgroundImage: `url("../../widgets/pomodoro/background.png")`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="flex flex-col items-center justify-between w-full h-full py-4 px-2 box-border">
				<div className="w-full px-4 flex m-0 gap-2">
					<button
						className={cn("border border-red-500 rounded-sm cursor-pointer flex-1 h-10 flex justify-center items-center", isBreak ? "bg-none" : "bg-red-200")}
						type="button"
						onClick={() => switchMode(false)}
					>
						{isBreak ? (<span className="relative top-1.5 text-2xl">Work</span>) : (
							<select className="border-none outline-none text-sm relative top-0.5">
								{eligibleTaskItems.map(item => {
									if (item.linked === "break") return null

									const text = disguishHiddenInformation(item.text)

									return (
										<option key={text} value={text}>{text.slice(0, 15)}</option>
									)
								})}
								<option value="casual work">Casual Work</option>
							</select>
						)}

					</button>
					<button
						className={cn("border border-red-500 rounded-sm cursor-pointer flex-1 h-10 flex justify-center items-center", isBreak ? "bg-red-200" : "bg-none")}
						type="button"
						onClick={() => switchMode(true)}
					>
						{isBreak ? (
							<select className="border-none outline-none text-sm relative top-0.5">
								{eligibleTaskItems.map(item => {
									if (item.linked === "work") return null

									const text = disguishHiddenInformation(item.text)

									return (
										<option key={text} value={text}>{text.slice(0, 15)}</option>
									)
								})}
								<option value="casual break">Casual Break</option>
							</select>
						) : (<span className="relative top-1.5 text-2xl">Break</span>)}
					</button>
				</div>

				<p
					className={cn(
						"text-2xl my-3 opacity-80 transition-all duration-800",
						!isRunning ? "opacity-0" : "",
					)}
				>
					{encouragement}
				</p>

				<div className="m-0">
					<input onChange={(event) => handleTimeChange(event)} className="text-6xl w-57 border-none outline-none caret-red-400" type="text" value={formatTime(timeLeft)} />
				</div>

				<img src={gifImage} className="h-25" alt="Timer Status" />

				<button
					onClick={handleClick}
					type="button"
					className="bg-none border-none cursor-pointer"
				>
					<img src={image} className="w-15" alt="Button" />
				</button>
			</div>
		</main>
	);
}

export default Pomodoro;
