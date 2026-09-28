import { cookies } from "next/headers";
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

const ROOM_NAME =
	process.env.LIVEKIT_ROOM ?? "parents-room";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const identity = body?.identity;

		if (
			identity !== "parents" &&
			identity !== "family"
		) {
			return NextResponse.json(
				{ error: "Invalid identity" },
				{ status: 400 },
			);
		}

		const cookieStore = await cookies();

		/*
		 * Seul quelqu'un authentifié comme famille
		 * peut obtenir un token "family".
		 */
		if (identity === "family") {
			const familyCookie =
				cookieStore.get("family_access")?.value;

			if (
				!familyCookie ||
				familyCookie !==
				process.env.FAMILY_ACCESS_CODE
			) {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 },
				);
			}
		}

		const token = new AccessToken(
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!,
			{
				identity,
				ttl: "3h",
			},
		);

		token.addGrant({
			roomJoin: true,
			room: ROOM_NAME,
			canPublish: true,
			canSubscribe: true,
		});

		return NextResponse.json({
			token: await token.toJwt(),
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
