"use client";

import { useState } from "react";
import VideoRoom from "@/components/VideoRoom";

export default function CallPage() {
	const [calling, setCalling] = useState(false);

	if (calling) {
		return (
			<VideoRoom identity="family" />
		);
	}

	return (
		<main className="call-screen">
			<div className="call-card">
				<h1>Maison des parents</h1>

				<p>
					Appelez directement la maison.
				</p>

				<button
					onClick={() => setCalling(true)}
					className="call-button"
				>
					📞 Appeler
				</button>
			</div>
		</main>
	);
}
