import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
import { createServerFn } from "@tanstack/react-start";

export const getAIResponse = createServerFn({ method: "POST" })
	.validator(
		(data: {
			threadId: string;
			key: string;
			prompt: string;
			scopes: Array<string>
		}) => data,
	)
	.handler(async ({ data }) => {
		try {
			const apiKey = data.key ?? process.env.FAI_API_KEY;

			if (!apiKey) {
				throw new Error("Fai API key missing");
			}

			const stream = chat({
				adapter: openRouterText("google/gemma-4-26b-a4b-it:free"),
				threadId: data.threadId
			})

			return toServerSentEventsResponse(stream)
		} catch (error) { }
	});
