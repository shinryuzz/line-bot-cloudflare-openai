import * as line from '@line/bot-sdk';

interface Env {
	LINE_CHANNEL_ACCESS_TOKEN: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const client = new line.messagingApi.MessagingApiClient({ channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN });

		const body = await request.text();
		const events = JSON.parse(body).events;

		await Promise.all(
			events
				.filter((e) => e.type === 'message' && e.message.type === 'text')
				.map((e) =>
					client.replyMessage({
						replyToken: e.replyToken,
						messages: [
							{
								type: 'text',
								text: e.message.text,
							},
						],
					})
				)
		);

		return new Response('OK');
	},
} satisfies ExportedHandler<Env>;
