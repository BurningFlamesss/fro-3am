import { toolDefinition } from "@tanstack/ai";
import z from "zod";
import { helpRegistry } from "./registry";

export const terminalExecutions = toolDefinition({
    name: "terminal_tools_execution",
    description: `Execute one or more terminal commands sequentially in a shadow background process.
    Available commands: 
    ${Object.entries(helpRegistry).map(([key, value]) => `${key}: ${value}`)}

    Use these commands whenever necessary. Donot hesitate to use the information gaining commands like ls, read, task.read, mem, event.read, get.theme, get.brightness, get.background. But, be near 75% sure to execute any command which has potential to mutate something.

    NOTES:
    (1) Most of the commands has "Usage: " attached. Carefully observe which type of arguments they need.
    (2) In general, anything inside "<", "[", "]", ">", if that text has small letters, it means it must be there (like: <somethingCOMMAND>, here exact "something" text must present and avoid any semantics carried by it), and block letter indicates to include its semantical meaning (like: <somethingCOMMAND>, here COMMAND should be chosen based on its semantical meaning.)
    (2) Argument enclosed in "<" ">" means they can have one of many values. eg: task.add <TASK> means "task.add" followed by the "task". Here, "task" can be anything and neednot be rigid among two-three options. Another example is set.brightness <0-100> where argument can be anything from 0 to 100.
    (3) Argument enclosed in "<*" ">" means they can have many values. eg: open <*APPS> means "open" followed by any natural numbered number of "apps" to open. Here, "apps" can be any app available in the OS and neednot be rigid.
    (4) Argument enclosed in "[" "]" means they can have one of provided values or follow a strict pattern.
    (4.1) If "[" "]" has "|" means that there are multiple options and you should anyone out of those options. eg: [--sha1 | --sha256 | --sha384 | --sha512] means you should choose anyone of --sha1, or --sha256, or --sha384, or --sha512. 
    (4.2) If "[" "]" has any symbol, or small lettered prefixes, indicates that those prefix must be present in the argument, followed by anything written in Capital letter which indicates what thing to have. eg: [--end@END] tells that --end@ is the prefix and should be there and END indicates that anything followed must satisfy the semantical meaning of END. 
    (5) For compound arguments, eg: event.add <TITLE> [@START] [--end@END] [+DURATION], <TITLE> means any text fulfilling the role of title, [@START] means follow START strictly after @ symbol, [--end@END] means follow END strictly after --end, and [+DURATION] means follow DURATION strictly after + symbol. Likewise, hash [--sha1 | --sha256 | --sha384 | --sha512] [--lenN, e.g. --len32] <TEXT>, means use any oneof --sha1, ..., --sha384, then N (number) should strictly follow after --len prefix, and <TEXT> indicates any Text fulfilling the need.
    `,
    inputSchema: z.object({
        commands: z.array(z.string()).describe("Ordered list of terminal commands to execute. e.g. ['cd notes', 'touch dc-circuits.frote', 'write dc-circuits.frote THE ANSWER']")
    }),
    outputSchema: z.object({
        results: z.array(z.string())
    })
})

export const faiTools = [terminalExecutions]