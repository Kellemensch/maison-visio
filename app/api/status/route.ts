import { RoomServiceClient } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ROOM_NAME = process.env.LIVEKIT_ROOM;

export async function GET() {
	try {
		if (!ROOM_NAME) {
			console.error("LIVEKIT_ROOM is not configured");

			return NextResponse.json(
				{
					error: "LIVEKIT_ROOM not configured",
				},
				{
					status: 500,
					headers: {
						"Cache-Control": "no-store",
					},
				},
			);
		}

		const livekitWsUrl = process.env.LIVEKIT_URL;

		if (!livekitWsUrl) {
			console.error("LIVEKIT_URL is not configured");

			return NextResponse.json(
				{
					error: "LIVEKIT_URL not configured",
				},
				{
					status: 500,
					headers: {
						"Cache-Control": "no-store",
					},
				},
			);
		}

		const livekitHttpUrl = livekitWsUrl.replace(
			/^wss:\/\//,
			"https://",
		);

		const roomService = new RoomServiceClient(
			livekitHttpUrl,
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!,
		);

		const rooms = await roomService.listRooms([
			ROOM_NAME,
		]);

		if (rooms.length === 0) {
			return NextResponse.json(
				{
					callActive: false,
					participants: [],
				},
				{
					headers: {
						"Cache-Control": "no-store",
					},
				},
			);
		}

		const participants =
			await roomService.listParticipants(
				ROOM_NAME,
			);

		const participantIdentities =
			participants.map(
				(participant) => participant.identity,
			);

		const familyConnected =
			participantIdentities.includes("family");

		console.log("Room:", ROOM_NAME);
		console.log(
			"Participants:",
			participantIdentities,
		);

		return NextResponse.json(
			{
				callActive: familyConnected,
				participants: participantIdentities,
			},
			{
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	} catch (error) {
		console.error("Status error:", error);

		return NextResponse.json(
			{
				callActive: false,
				error: "Unable to check call status",
			},
			{
				status: 500,
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	}
}
