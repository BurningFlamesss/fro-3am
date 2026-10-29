import { toolDefinition } from "@tanstack/ai";
import z from "zod";
import { helpRegistry } from "./registry";

export const terminalExecutions = toolDefinition({
    name: "terminal_tools_execution",
    description: `Execute one or more terminal commands sequentially in a shadow background process.
    Available commands: 
    ${Object.entries(helpRegistry).map(([key, value]) => `${key}: ${value}`)}
    `,
    inputSchema: z.object({
        commands: z.array(z.string()).describe("Ordered list of terminal commands to execute. e.g. ['cd notes', 'touch dc-circuits.frote', 'write dc-circuits.frote THE ANSWER']")
    }),
    outputSchema: z.object({
        results: z.array(z.string())
    })
})

export const faiTools = [terminalExecutions]