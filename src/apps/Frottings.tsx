import { IoMdCheckmark } from "react-icons/io";
import { cn } from "#/lib/utils.ts";
import { useSettingStore } from "#/store/setting.tsx";
import { backgrounds } from "#/constants/theme.tsx";

function Frottings() {
	const { backgroundImage, setBackgroundImage } = useSettingStore();
	return (
		<div className="p-4">
			<h2 className="mb-4 text-lg font-semibold">Backgrounds</h2>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{backgrounds.map((background) => {
					const selected = backgroundImage.url === background.url;

					return (
						<button
							key={background.name}
							type="button"
							onClick={() =>
								setBackgroundImage(background.url, background.position)
							}
							className={cn(
								"group relative overflow-hidden rounded-xl border transition-all cursor-pointer",
								"hover:border-white/30",
								selected
									? "border-primary ring-2 ring-primary/40"
									: "border-white/10",
							)}
						>
							<img
								src={`${background.url.replace("/backgrounds", "/backgrounds/previews").replace(".gif", ".webp")}`}
								alt={background.name}
								loading="lazy"
								className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>

							<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-2">
								<p className="truncate text-xs font-medium text-white">
									{background.name
										.split("-")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</p>
							</div>

							{selected && (
								<div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
									<IoMdCheckmark />
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default Frottings;
