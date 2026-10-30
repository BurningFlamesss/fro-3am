import { Delete, Link } from "lucide-react";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { COMPLETED_MARKER, cn, decodeHiddenInformation, disguishHiddenInformation, END_HIDING_PATTERN, getStartAndEndOfHiddenPattern, INCOMPLETE_MARKER, START_HIDING_PATTERN, TASK_TAB_ID } from "#/lib/utils.ts";
import { useNoteStore } from "#/store/note.tsx";
import { useSettingStore } from "#/store/setting.tsx";

function Task() {
	const { tabs, addTab, updateContent } = useNoteStore();
	const theme = useSettingStore((state) => state.theme);

	const taskTab = tabs.find((tab) => tab.id === TASK_TAB_ID);
	const content = taskTab?.content ?? "";

	const taskItems = content
		.split("\n")
		.map((line) => {
			const trimmed = line.trim();
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
				return {
					text: trimmed.slice(COMPLETED_MARKER.length).trim(),
					completed: true,
					linked,
					priority
				};
			}
			if (trimmed.startsWith(INCOMPLETE_MARKER)) {
				return {
					text: trimmed.slice(INCOMPLETE_MARKER.length).trim(),
					completed: false,
					linked,
					priority
				};
			}
			return { text: trimmed, completed: false, linked, priority };
		})
		.filter((item) => item.text.length > 0)
		.sort((a, b) => a.priority - b.priority);

	const buildContent = (items: typeof taskItems) =>
		items
			.map(
				(item) =>
					`${item.completed ? COMPLETED_MARKER : INCOMPLETE_MARKER} ${item.text}`,
			)
			.join("\n");

	const handleAddTask = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return;

		if (!taskTab) {
			addTab("Tasks", `${INCOMPLETE_MARKER} ${trimmed}`, TASK_TAB_ID, "todo");
		} else {
			const newItems = [...taskItems, { text: trimmed, completed: false, linked: "", priority: 0 }];
			const newContent = buildContent(newItems);
			updateContent(TASK_TAB_ID, newContent);
		}
	};

	const handleDeleteTask = (index: number) => {
		const updatedItems = taskItems.filter((item, i) =>
			i !== index
		);
		const newContent = buildContent(updatedItems);
		updateContent(TASK_TAB_ID, newContent);
	};

	const toggleLink = (index: number) => {
		if (!taskTab) return;

		const { startIndexOfStartPattern } = getStartAndEndOfHiddenPattern(taskItems[index].text)

		const updatedItems = taskItems.map((item, i) => {
			if (i !== index) {
				return item
			}

			let linkedTo: string = ""
			let priority: number = 0

			if (!item.linked) {
				linkedTo = prompt("Where do you want to link the task? (work/break)") ?? ""
				priority = +(prompt("What should be the priority of the task? (0-9)") ?? 0)
			}


			const linked = item.linked ? "" : `linked-to=${linkedTo}`
			const text = item.linked ? item.text.slice(0, startIndexOfStartPattern) : `${item.text} ${START_HIDING_PATTERN}${linked},priority=${priority}${END_HIDING_PATTERN}`

			return { ...item, text, linked, priority }
		});
		const newContent = buildContent(updatedItems);
		updateContent(TASK_TAB_ID, newContent);
	};

	const toggleTask = (index: number) => {
		if (!taskTab) return;

		const updatedItems = taskItems.map((item, i) =>
			i === index ? { ...item, completed: !item.completed } : item,
		);
		const newContent = buildContent(updatedItems);
		updateContent(TASK_TAB_ID, newContent);
	};

	return (
		<ul className={cn("p-4 min-h-full w-full text-white flex flex-col gap-y-2", theme.colourScheme)}>
			<input
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleAddTask(e.currentTarget.value);
						e.currentTarget.value = "";
					}
				}}
				placeholder="Add your task"
				className="max-h-6 flex-1 bg-transparent text-sm text-white border-b border-b-transparent focus:border-b-white transition-all duration-75 focus:outline-none placeholder:text-white/40"
			/>
			{taskItems.map((task, index) => (
				<li
					title={`Linked to: ${task.linked ? task.linked : "None"}, Priority: ${task.priority}`}
					key={`widget-task-${index}`}
					className="flex justify-between items-center group/task"
				>
					<div className="flex justify-start items-center gap-x-2">
						<Checkbox
							className="cursor-pointer"
							checked={task.completed}
							onCheckedChange={() => toggleTask(index)}
						/>
						<span className={task.completed ? "line-through opacity-60" : ""}>
							{disguishHiddenInformation(task.text)}
						</span>
					</div>

					<div className="flex justify-end items-center gap-x-2">
						<Link onClick={() => toggleLink(index)} size={16} className={cn("group-hover/task:flex hidden cursor-pointer hover:text-green-400", task.linked ? "text-blue-400 hover:text-red-400" : "")} />
						<Delete onClick={() => handleDeleteTask(index)} size={18} className="group-hover/task:flex hidden cursor-pointer hover:text-red-400" />
					</div>
				</li>
			))}
		</ul>
	);
}

export default Task;
