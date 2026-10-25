import { Checkbox } from "#/components/ui/checkbox.tsx";
import { cn } from "#/lib/utils.ts";
import { useNoteStore } from "#/store/note.tsx";
import { useSettingStore } from "#/store/setting.tsx";
import { useWidgetAppsStore } from "#/store/widgetApps.tsx";
import { Delete, Link } from "lucide-react";

export const TASK_TAB_ID = "user-task.todo";
export const COMPLETED_MARKER = "[x]";
export const COMPLETE_LINKED_MARKER = "{x}"
export const INCOMPLETE_LINKED_MARKER = "{ }"
export const INCOMPLETE_MARKER = "[ ]";

function Task() {
	const { tabs, addTab, updateContent } = useNoteStore();
	const widgetStates = useWidgetAppsStore(state => state.widgetStates)
	const updateWidgetState = useWidgetAppsStore(state => state.updateWidgetState)
	const theme = useSettingStore((state) => state.theme);

	const taskTab = tabs.find((tab) => tab.id === TASK_TAB_ID);
	const content = taskTab?.content ?? "";
	const linkedIndex = widgetStates?.["widget_task"]?.linkedIndex ?? -1

	const taskItems = content
		.split("\n")
		.map((line) => {
			const trimmed = line.trim();
			if (trimmed.startsWith(COMPLETED_MARKER)) {
				return {
					text: trimmed.slice(COMPLETED_MARKER.length).trim(),
					completed: true,
					linked: false
				};
			}
			if (trimmed.startsWith(INCOMPLETE_MARKER)) {
				return {
					text: trimmed.slice(INCOMPLETE_MARKER.length).trim(),
					completed: false,
					linked: false
				};
			}
			if (trimmed.startsWith(COMPLETE_LINKED_MARKER)) {
				return {
					text: trimmed.slice(COMPLETE_LINKED_MARKER.length).trim(),
					completed: true,
					linked: true
				};
			}
			if (trimmed.startsWith(INCOMPLETE_LINKED_MARKER)) {
				return {
					text: trimmed.slice(INCOMPLETE_LINKED_MARKER.length).trim(),
					completed: false,
					linked: true
				};
			}
			return { text: trimmed, completed: false, linked: false };
		})
		.filter((item) => item.text.length > 0);

	const buildContent = (items: typeof taskItems) =>
		items
			.map(
				(item) =>
					`${item.linked ? item.completed ? COMPLETE_LINKED_MARKER : INCOMPLETE_LINKED_MARKER : item.completed ? COMPLETED_MARKER : INCOMPLETE_MARKER} ${item.text}`,
			)
			.join("\n");

	const handleAddTask = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return;

		if (!taskTab) {
			addTab("Tasks", `${INCOMPLETE_MARKER} ${trimmed}`, TASK_TAB_ID, "todo");
		} else {
			const newItems = [...taskItems, { text: trimmed, completed: false, linked: false }];
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

	const handleLinkTask = (index: number) => {
		if (!taskTab) return;

		const updatedItems = taskItems.map((item, i) =>
			i === index ? { ...item, linked: !item.linked } : item,
		);
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
							{task.text}
						</span>
					</div>

					<div className="flex justify-end items-center gap-x-2">
						<Link onClick={() => handleLinkTask(index)} size={16} className={cn("group-hover/task:flex hidden cursor-pointer hover:text-green-400", task.linked ? "text-blue-400 hover:text-red-400" : "")} />
						<Delete onClick={() => handleDeleteTask(index)} size={18} className="group-hover/task:flex hidden cursor-pointer hover:text-red-400" />
					</div>
				</li>
			))}
		</ul>
	);
}

export default Task;
