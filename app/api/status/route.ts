import { RoomServiceClient } from "livekit-server-sdk";
import { NextResponse } from "next/server";

const ROOM_NAME = "parents-room";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const livekitUrl = process.env.LIVEKIT_URL!;
		const livekitHttpUrl = livekitUrl.replace(/^wss:\/\//, "https://");

		const roomService = new RoomServiceClient(
			livekitHttpUrl,
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!,
		);

		const rooms = await roomService.listRooms([ROOM_NAME]);

		if (rooms.length === 0) {
			return NextResponse.json(
				{
					callActive: false,
				},
				{
					headers: {
						"Cache-Control": "no-store",
					},
				},
			);
		}

		const participants = await roomService.listParticipants(ROOM_NAME);

		const familyConnected = participants.some(
			(participant) => participant.identity === "family",
		);

		return NextResponse.json(
			{
				callActive: familyConnected,
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
			{ callActive: false },
			{
				status: 500,
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	}
}
