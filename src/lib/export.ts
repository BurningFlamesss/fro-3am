import { type FileNode } from "#/store/fs.tsx";
import JSZip from "jszip";

type ExportOptions = "zip" | "json";

export function Export(
	option: ExportOptions,
	ids: Array<FileNode["id"]>,
	nodes: Record<string, FileNode>,
	getChildren: (parentId: string) => Array<FileNode>,
) {
	const roots = new Set(ids);
	const stamp = new Date().toISOString();

	switch (option) {
		case "zip":
			const zip = new JSZip();
			break;

		case "json":
			const data = nodes;
			break;

		default:
			break;
	}
}
