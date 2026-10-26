import { e, evaluate } from "mathjs";
import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { cn, formatTime, generateTypingParagraph } from "#/lib/utils.ts";
import resetImg from "../../public/widgets/pomodoro/reset.png";
import { useWindowStore } from "./window";
import { totalWordCount, words } from "#/constants/words.tsx";

export type LaunchProps = {
	windowId?: string;
	params?: Array<string>;
	[key: string]: unknown;
};

export interface Launchable {
	id: string;
	name: string;
	source:
	| {
		type: "ftml";
		code: string;
	}
	| {
		type: "fromponent";
		code: ComponentType<LaunchProps>;
	};
	shortcut?:
	| {
		name: string;
	}
	| false;
	logo: string;
	showInCollections?: boolean;
	extension?: Array<string>;
}

interface LauncherStore {
	launchables: Record<string, Launchable>;
	recentLaunches: Map<string, number>;
	launch: (data: Launchable, props?: Record<string, unknown>) => void;
}

export const useLauncherStore = create<LauncherStore>()(
	immer((set) => {
		return {
			launchables: {
				app_not_found: {
					id: "app_not_found",
					name: "App not found",
					source: {
						type: "fromponent",
						code: AppNotFound,
					},
					logo: "/apps/Game.svg",
					showInCollections: false,
				},
				app_fypemaster: {
					id: "app_fypemaster",
					name: "Fypemaster",
					logo: "/apps/FypeMaster.svg",
					source: {
						type: "fromponent",
						code: FypeMaster,
					},
					showInCollections: true,
				},
				app_frodle: {
					id: "app_frodle",
					name: "Frodle",
					logo: "/apps/Frodle.svg",
					source: {
						type: "fromponent",
						code: Frodle,
					},
					showInCollections: true,
				},
				app_fentalMaths: {
					id: "app_fentalMaths",
					name: "Fental Maths",
					logo: "/apps/FentalMaths.svg",
					source: {
						type: "fromponent",
						code: MentalMathGame,
					},
					showInCollections: true,
				},
			},
			recentLaunches: new Map<string, number>(),
			launch: (data, props) =>
				set((state) => {
					state.launchables[data.id] = data;
					state.recentLaunches.set(data.id, Date.now());

					useWindowStore.getState().openApp("launcher", undefined, false, {
						launchSpecification: {
							name: data.name,
							source: data.source,
						},
						title: data.name,
						logo: data.logo,
						...props,
					});
				}),
		};
	}),
);

function AppNotFound() {
	return (
		<main className="min-h-full w-full flex flex-col items-center justify-center overflow-hidden">
			<div className="min-h-full w-full flex flex-row items-center justify-center text-8xl font-black tracking-tight text-[#69C242]">
				4<img src="/logo.png" className="w-32 h-32" alt="" />4
			</div>
			<p className="text-xl font-semibold text-primary">
				Are you f*#king kidding me?
			</p>
			<p>
				Uh-oh! App not found. (*I meant*{" "}
				<span className="text-primary font-semibold">"Froking"</span>)
			</p>
		</main>
	);
}

function FypeMaster({ params }: LaunchProps) {
	const requestedLength = Number(params?.[0]);

	const typingParagraphLength =
		Number.isFinite(requestedLength) && requestedLength > 0
			? requestedLength
			: 100;

	const [typingParagraph, setTypingParagraph] = useState(() =>
		generateTypingParagraph(typingParagraphLength),
	);

	const characters = useMemo(() => [...typingParagraph], [typingParagraph]);

	const startedAt = useRef<number | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const [typedText, setTypedText] = useState("");

	const [stats, setStats] = useState<{
		wpm: number;
		accuracy: number;
		time: number;
		correct: number;
		incorrect: number;
	} | null>(null);

	const completed = stats !== null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (completed) return;

		const value = e.target.value;

		if (value.length > typingParagraph.length) {
			return;
		}

		if (startedAt.current === null && value.length > 0) {
			startedAt.current = performance.now();
		}

		setTypedText(value);

		if (value.length !== typingParagraph.length) {
			return;
		}

		const endedAt = performance.now();

		const elapsedMinutes = (endedAt - startedAt.current!) / 60000;

		let correct = 0;

		for (let i = 0; i < value.length; i++) {
			if (value[i] === typingParagraph[i]) {
				correct++;
			}
		}

		const incorrect = value.length - correct;

		setStats({
			time: elapsedMinutes * 60,
			wpm: correct / 5 / elapsedMinutes,
			accuracy: (correct / value.length) * 100,
			correct,
			incorrect,
		});
	};

	if (completed) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="w-120 rounded-xl p-6">
					<h1 className="text-3xl font-bold">Typing Complete</h1>

					<div className="mt-8 grid grid-cols-2 gap-6">
						<div>
							<p className="text-muted-black">Speed</p>
							<p className="text-3xl font-bold">{stats.wpm.toFixed(1)}</p>
							<p>WPM</p>
						</div>

						<div>
							<p className="text-muted-black">Accuracy</p>
							<p className="text-3xl font-bold">{stats.accuracy.toFixed(1)}%</p>
						</div>

						<div>
							<p className="text-muted-black">Time</p>
							<p className="text-3xl font-bold">{stats.time.toFixed(2)}s</p>
						</div>

						<div>
							<p className="text-muted-black">Mistakes</p>
							<p className="text-3xl font-bold">{stats.incorrect}</p>
						</div>
					</div>

					<div className="mt-8 flex justify-end gap-3">
						<button
							type="button"
							onClick={() => {
								setStats(null);
								setTypedText("");
								startedAt.current = null;

								setTypingParagraph(
									generateTypingParagraph(typingParagraphLength),
								);

								inputRef.current?.focus();
							}}
							className="rounded-md bg-primary px-4 py-2 text-primary-black cursor-pointer"
						>
							Restart
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="relative h-full w-full p-8 flex items-center justify-center"
			onClick={() => inputRef?.current?.focus()}
		>
			<input
				ref={inputRef}
				autoFocus
				spellCheck={false}
				autoCorrect="off"
				autoCapitalize="off"
				className="absolute pointer-events-none opacity-0"
				value={typedText}
				onChange={handleChange}
			/>

			<p className="font-mono text-2xl leading-relaxed whitespace-pre-wrap wrap-break-word select-none">
				{characters.map((char, index) => {
					const typed = typedText[index];

					let className = "text-gray-300";

					if (typed !== undefined) {
						className = typed === char ? "text-green-500" : "text-red-500";
					}

					const isCurrent = index === typedText.length;

					return (
						<span
							key={`typed-character-${index}-${char}`}
							className={cn("relative inline-block", className)}
						>
							{isCurrent && (
								<span className="absolute left-0 top-2 bottom-0 h-6 w-0.5 bg-primary animate-caret-blink delay-100" />
							)}

							{char === " " ? "\u00A0" : char}
						</span>
					);
				})}
			</p>
		</div>
	);
}

function Frodle({ params }: LaunchProps) {
	const structure = [5, 5, 5, 5, 5]
	const [randomWord, setRandomWord] = useState<string>("")
	const [guesses, setGuesses] = useState<Record<number, string>>({
		1: "",
		2: "",
		3: "",
		4: "",
		5: ""
	})

	useEffect(() => {
		const randomWordIndex = Math.floor(Math.random() * totalWordCount)
		const word = words[randomWordIndex][0]
		console.log("Word: ", word)
		setRandomWord(word)
	}, [])

	return (
		<main className="min-h-full min-w-full flex flex-col items-center justify-start">
			<nav className="w-full p-4 flex flex-row justify-between items-center"></nav>
			<section className="min-h-full min-w-full flex flex-row items-center justify-center">
				<table className="h-64 w-64 flex flex-row items-center justify-between gap-x-2">
					{structure.map((row) => {

						return (
							<tr className="flex flex-col items-center justify-between gap-y-2">
								{Array.from({ length: row }).map((col) => {

									return (
										<td className="h-12 w-12 rounded-xl border-2 border-blue-500 flex flex-row items-center justify-center">
											<input className="min-h-full min-w-full flex flex-row items-center justify-center border-0 outline-0 text-center" />
											</td>
									)
								})}
							</tr>
						)
					})}
				</table>
			</section>
		</main>
	)
}

function MentalMathGame({ params }: LaunchProps) {
	const frameRef = useRef<number>(0)
	const inputRef = useRef<HTMLInputElement>(null)
	const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	const operations = ["+", "-"]
	const levelSystem = {
		easy: {
			operatorCount: 1,
			operandCount: 2,
			bracesCount: 0,
			letterMaxCap: [1, 2],
			allowMultiplication: false,
			allowDivision: false
		},
		medium: {
			operatorCount: 2,
			operandCount: 3,
			bracesCount: 2,
			letterMaxCap: [2],
			allowMultiplication: true,
			allowDivision: false
		},
		high: {
			operatorCount: 3,
			operandCount: 4,
			bracesCount: 4,
			letterMaxCap: [2],
			allowMultiplication: true,
			allowDivision: false
		},
		extreme: {
			operatorCount: 3,
			operandCount: 4,
			bracesCount: 4,
			letterMaxCap: [2],
			allowMultiplication: true,
			allowDivision: true
		}
	}

	// immediate logic to me is generate
	// (1 operator, and 2 operands 1-2 digit for easy level), 
	// (2 operator, 3 operands 2 digit, and 1 brace for medium), 
	// (3 operators, 4 operands 2 digit, and 2 brace for high)
	// order: operand + operator + operand
	//  || braceOpen + operand + operator + operand + braceClose + operand + operator + operand
	//  || braceOpen + braceOpen* operand + operator + operand + braceClose* + operand + operator + operand + braceClose + operand + operator + operand
	//  || braceOpen + operand + operator + operand + braceClose + operand + operator + operand + braceOpen + operand + operator + operand + braceClose
	function generateQuestionAndAnswer(level: "easy" | "medium" | "high" | "extreme") {
		let questionTerms = []

		const { operatorCount, bracesCount, letterMaxCap, operandCount, allowDivision, allowMultiplication } = levelSystem[level]

		if (allowMultiplication) {
			operations.push("*")
		}
		if (allowDivision) {
			operations.push("/")
		}

		const operators = []
		const operands = []

		for (let index = 0; index < operatorCount; index++) {
			operators[index] = operations[Math.floor(Math.random() * operations.length)];
		}

		for (let index = 0; index < operandCount; index++) {
			const maxCap = letterMaxCap[Math.floor(Math.random() * letterMaxCap.length)]
			operands[index] = Math.max(numbers.length ** (maxCap - 1), Math.floor(Math.random() * numbers.length ** maxCap));
		}

		const questionLengthEstimate = operandCount + operatorCount
		const sequence = ["operand", "operator"]

		for (let index = 0; index < questionLengthEstimate; index++) {
			const seq = sequence[index % sequence.length]
			const turn = Math.floor(index / sequence.length)

			if (seq === "operand") {
				questionTerms.push(operands[turn])
			} else {
				questionTerms.push(operators[turn])
			}
		}

		switch (bracesCount) {
			case 0:

				break;

			case 2: {
				const possibleStartIndices = [0, 2]
				const random = possibleStartIndices[Math.floor(Math.random() * possibleStartIndices.length)]
				questionTerms.splice(random, 0, "(")
				questionTerms.splice(random + 4, 0, ")")
				break;
			}
			case 4: {
				const random = Math.floor(Math.random() * 5)

				switch (random) {
					case 0: {
						questionTerms.splice(0, 0, "(")
						questionTerms.splice(4, 0, ")")
						questionTerms.splice(6, 0, "(")
						questionTerms.splice(10, 0, ")")
						break;
					}
					case 1: {
						questionTerms.splice(0, 0, "(") // {
						questionTerms.splice(1, 0, "(")
						questionTerms.splice(5, 0, ")")
						questionTerms.splice(8, 0, ")") // }
						break;
					}
					case 2: {
						questionTerms.splice(0, 0, "(") // {
						questionTerms.splice(3, 0, "(")
						questionTerms.splice(7, 0, ")")
						questionTerms.splice(8, 0, ")") // }
						break;
					}
					case 3: {
						questionTerms.splice(2, 0, "(") // {
						questionTerms.splice(3, 0, "(")
						questionTerms.splice(7, 0, ")")
						questionTerms.splice(10, 0, ")") // }
						break;
					}
					case 4: {
						questionTerms.splice(2, 0, "(") // {
						questionTerms.splice(5, 0, "(")
						questionTerms.splice(9, 0, ")")
						questionTerms.splice(10, 0, ")") // }
						break;
					}

					default:
						break;
				}
				break;
			}
			default:
				break;
		}

		const question = questionTerms.join(" ")

		return {
			question,
			answer: evaluate(question) as number
		}
	}

	const [level, setLevel] = useState<"easy" | "medium" | "high" | "extreme">("easy")
	const [question, setQuestion] = useState<string>("")
	const [answer, setAnswer] = useState<number>(0)
	const [timeLeft, setTimeLeft] = useState<number>(1 * 60);
	const [isRunning, setIsRunning] = useState<boolean>(true);
	const [value, setValue] = useState<string>("")
	const endTimeRef = useRef<number>(0);
	const totalDurationRef = useRef<number>(1 * 60);
	const [score, setScore] = useState<number>(0)

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}

		const { answer: ans, question: ques } = generateQuestionAndAnswer(level)

		setQuestion(ques)
		setAnswer(ans)
	}, [])

	useEffect(() => {
		if (value.trim()) {
			const writtenAnswer = Number(value.trim())

			if (writtenAnswer === Math.floor(answer)) {
				const { answer: ans, question: ques } = generateQuestionAndAnswer(level)

				setValue("")

				setScore(prev => prev + 1)
				setQuestion(ques)
				setAnswer(ans)
			}

		}
	}, [value])

	useEffect(() => {
		if (!isRunning) {
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
				frameRef.current = requestAnimationFrame(updateTimer);
			} else {
				setIsRunning(false);
				setTimeLeft(0);
			}
		};

		const remainingSeconds = timeLeft;

		endTimeRef.current = Date.now() + remainingSeconds * 1000;
		requestAnimationFrame(updateTimer)
		frameRef.current = requestAnimationFrame(updateTimer);

		return () => {
			cancelAnimationFrame(frameRef.current)
		};
	}, [isRunning, level]);

	return (
		<main className="min-h-full min-w-full flex flex-col items-center justify-start">
			<nav className="w-full p-4 flex flex-row justify-between items-center">
				<span>
					<select
						onClick={(e) => {
							e.stopPropagation();
						}}
						id={level}
						value={level}
						onChange={(event) => {
							const newLevel = event.target.value as "easy" | "extreme" | "high" | "medium"
							setLevel(newLevel)
							setTimeLeft(1 * 60)
							setScore(0)
							setValue("")

							const { answer: ans, question: ques } = generateQuestionAndAnswer(newLevel)
							setQuestion(ques)
							setAnswer(ans)

							setIsRunning(true)

							if (inputRef.current) {
								inputRef.current.focus()
							}
						}}
						className="border-0 outline-0 bg-transparent text-white text-xs cursor-pointer"
					>
						<option className="text-black cursor-pointer" value="easy">
							EASY
						</option>
						<option className="text-black cursor-pointer" value="medium">
							MEDIUM
						</option>
						<option className="text-black cursor-pointer" value="high">
							HIGH
						</option>
						<option className="text-black cursor-pointer" value="extreme">
							EXTREME
						</option>
					</select>
				</span>
				<div className="flex flex-row items-center justify-center gap-4">
					<span>Score: {score}</span>
					<span>{formatTime(timeLeft)}</span>
				</div>
			</nav>

			{timeLeft === 0 ? (
				<section className="h-full w-full flex flex-col items-center justify-center p-4 gap-y-8 my-auto">
					<h1 className="text-4xl font-black">Your score is {score}.</h1>

					<button
						onClick={() => {
							setTimeLeft(1 * 60)
							setScore(0)
							setValue("")

							const { answer: ans, question: ques } = generateQuestionAndAnswer(level)
							setQuestion(ques)
							setAnswer(ans)

							setIsRunning(true)

							if (inputRef.current) {
								inputRef.current.focus()
							}
						}}
						type="button"
						className="bg-none border-none cursor-pointer"
					>
						<img src={resetImg} className="w-15" alt="Button" />
					</button>

				</section>
			) : (
				<section className="h-full w-full flex flex-col items-center justify-center p-4 gap-y-8">
					<h1 className="text-4xl font-black">{question}</h1>

					<input
						value={value}
						onChange={e => setValue(prev => e.target.value)}
						ref={inputRef}
						className="caret-green-500 border-0 border-b-2 outline-0 min-w-3/4 min-h-16 text-2xl font-black text-center"
						type="text"
					/>
				</section>
			)}

		</main>
	)
}