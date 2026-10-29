import { terminalExecutions } from "#/constants/fai-tools.tsx";
import { chat, maxIterations, toServerSentEventsResponse, type UIMessage } from "@tanstack/ai";
import { createOpenRouterText, openRouterText } from "@tanstack/ai-openrouter";
import { createServerFn } from "@tanstack/react-start";


export const getAIResponse = createServerFn({ method: "POST" })
	.validator(
		(data: {
			messages: Array<UIMessage>;
			threadId: string;
			key: string;
			prompt: string;
			scopes: Array<string>
		}) => data,
	)
	.handler(async ({ data }) => {
		try {
			console.log("getAIResponse called!!")
			const apiKey = data.key || process.env.FAI_API_KEY;

			if (!apiKey) {
				throw new Error("Fai API key missing");
			}

			console.log("Inner getAIResponse called!!")
			const adapter = createOpenRouterText("nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", apiKey)

			const stream = chat({
				adapter: adapter,
				threadId: data.threadId,
				messages: data.messages,
				tools: [terminalExecutions],
				systemPrompts: data.prompt ? [data.prompt] : undefined,
				agentLoopStrategy: maxIterations(5)
			})

			console.log("Stream received:", stream)

			return toServerSentEventsResponse(stream)
		} catch (error) {
			const normalizeError = error instanceof Error ? error.message : String(error)
			console.error("AI Server Error: ", normalizeError)
			throw new Error(normalizeError)
		}
	});
