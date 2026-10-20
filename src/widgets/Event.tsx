import { cn, formatEventRange, parseDate } from "#/lib/utils.ts";
import { useCalendarStore } from "#/store/calendar.tsx";
import { useSettingStore } from "#/store/setting.tsx";

function Event() {
	const { events } = useCalendarStore();
	const theme = useSettingStore((state) => state.theme);

	const now = new Date();
	const upcoming = events
		.filter((event) => parseDate(event.end) >= now)
		.sort(
			(a, b) =>
				(parseDate(a.start)?.getTime() ?? 0) -
				(parseDate(b.start)?.getTime() ?? 0),
		)
		.slice(0, 5);

	return upcoming.length > 0 ? (
		<ul className={cn("p-4 min-h-full w-full text-white", theme.colourScheme)}>
			{upcoming.map((tab, index) => (
				<li key={tab.id}>
					{index + 1}. {tab.title}
					<br />
					<span className="opacity-90 text-sm">
						{formatEventRange(tab.start, tab.end)}
					</span>
				</li>
			))}
		</ul>
	) : (
		<div className={cn("text-white h-full w-full flex flex-row items-center justify-center", theme.colourScheme)}>
			No Any Upcoming Events
		</div>
	);
}

export default Event;
