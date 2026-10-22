import JSZip from "jszip";
import { type FileNode } from "#/store/fs.tsx";

type ExportOptions = "zip" | "json";

const collectNodes = (
	ids: Array<FileNode["id"]>,
	nodes: Record<string, FileNode>,
	getChildren: (parentId: string) => Array<FileNode>,
) => {
	const all: Array<FileNode> = [];
	const walked = new Set<string>();

	const walk = (id: string) => {
		if (walked.has(id)) return;

		const node = nodes[id];
		if (!node) return;
		walked.add(id);
		all.push(node);

		if (node.type === "folder") {
			for (const child of getChildren(id)) {
				return walk(child.id);
			}
		}
	};

	ids.forEach(walk);
	return all;
};

export async function Export(
	option: ExportOptions,
	ids: Array<FileNode["id"]>,
	nodes: Record<string, FileNode>,
	getChildren: (parentId: string) => Array<FileNode>,
) {
	const all = collectNodes(ids, nodes, getChildren);
	const roots = new Set(ids);
	const stamp = new Date().toISOString();

	switch (option) {
		case "zip":
			const zip = new JSZip();
            // add files to zip and download

            const blob = await zip.generateAsync({ type: "blob" })
			break;

		case "json":
            // Entire logic
			const data = nodes;
			break;

		default:
			break;
	}
}
