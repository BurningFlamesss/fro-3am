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

const download = (blob: Blob, fileName: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
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
		case "zip": {
			const zip = new JSZip();

			// add files to zip and download
			for (const node of all) {
			}

			const blob = await zip.generateAsync({ type: "blob" });
			download(blob, `froxplorer-export.zip`);
			break;
		}

		case "json": {
			const data = all.map((node) => ({
				id: node.id,
				name: node.name,
				type: node.type,
				parentId: node.parentId,
				path: "",
				content: node.content,
			}));

			download(
				new Blob([JSON.stringify(data, null, 2)], {
					type: "application/json",
				}),
				"froxplorer-export.json",
			);
			break;
		}

		default:
			break;
	}
}
