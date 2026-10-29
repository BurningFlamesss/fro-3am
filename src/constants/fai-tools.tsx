import { toolDefinition } from "@tanstack/ai";
import z from "zod";

export const terminalExecutions = toolDefinition({
    name: "terminal_tools_execution",
    description: "",
    inputSchema: z.object({
        commands: z.array(z.string()).describe("")
    }),
    outputSchema: z.object({
        results: z.array(z.string())
    })
})

export const faiTools = [terminalExecutions]