import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

const ROOM_NAME = "parents-room";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const identity = body?.identity;

		if (identity !== "parents" && identity !== "family") {
			return NextResponse.json(
				{ error: "Invalid identity" },
				{ status: 400 },
			);
		}

		const token = new AccessToken(
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!,
			{
				identity,
				ttl: "2h",
			},
		);

		token.addGrant({
			roomJoin: true,
			room: ROOM_NAME,
			canPublish: true,
			canSubscribe: true,
		});

		const jwt = await token.toJwt();

		return NextResponse.json({
			token: jwt,
			serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL,
		});
	} catch (error) {
		console.error("Token generation error:", error);

		return NextResponse.json(
			{ error: "Unable to generate token" },
			{ status: 500 },
		);
	}
}
