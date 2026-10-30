import JSZip from "jszip";
import { ParenthesisNode } from "mathjs";
import { type FileNode } from "#/store/fs.tsx";

export type ExportOptions = "zip" | "json";

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

const relativePath = (node: FileNode, roots: Set<string>, all: Array<FileNode>) => {
	const parts = [];
	let current = node;

	while (current) {
		parts.unshift(node.name);

		if (roots.has(current.id)) break

		current = current?.parentId ? all?.[current.parentId] : undefined
	}

	return parts.join("/")
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
				const path = relativePath(node, roots, all);
				console.log("Path: ", path)

				switch (node.type) {
					case "folder":
						zip.folder(path);
						break;

					case "file":
						zip.file(path, node.content ?? "");
						break;

					default:
						zip.file(path, node.content ?? "");
						break;
				}
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
