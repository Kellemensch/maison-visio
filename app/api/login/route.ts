import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	console.log("FAMILY_ACCESS_CODE defined?", !!process.env.FAMILY_ACCESS_CODE);
	console.log("FAMILY_ACCESS_CODE value:", process.env.FAMILY_ACCESS_CODE);
	try {
		const body = await request.json();

		const providedCode = body?.code;

		if (
			typeof providedCode !== "string" ||
			!process.env.FAMILY_ACCESS_CODE
		) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		if (
			providedCode !==
			process.env.FAMILY_ACCESS_CODE
		) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const cookieStore = await cookies();

		cookieStore.set(
			"family_access",
			process.env.FAMILY_ACCESS_CODE,
			{
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60 * 24 * 30,
			},
		);

		return NextResponse.json({
			ok: true,
		});
	} catch (error) {
		console.error("Family login error:", error);

		return NextResponse.json(
			{ error: "Invalid request" },
			{ status: 400 },
		);
	}
}
