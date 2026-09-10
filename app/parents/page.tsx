"use client";

import { useEffect, useState } from "react";
import VideoRoom from "@/components/VideoRoom";

export default function ParentsPage() {
	const [callActive, setCallActive] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		let mounted = true;

		async function checkStatus() {
			try {
				const response = await fetch("/api/status", {
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Status error");
				}

				const data = await response.json();

				if (mounted) {
					setCallActive(data.callActive);
					setError(false);
				}
			} catch (err) {
				console.error(err);

				if (mounted) {
					setError(true);
				}
			}
		}

		checkStatus();

		const interval = setInterval(checkStatus, 2000);

		return () => {
			mounted = false;
			clearInterval(interval);
		};
	}, []);

	if (callActive) {
		return <VideoRoom identity="parents" />;
	}

	return (
		<main className="parents-idle">
			<div className="parents-card">
				<div className="status-dot" />

				<h1>Maison</h1>

				<p>
					En attente d'un appel...
				</p>

				{error && (
					<small>
						Vérification de connexion...
					</small>
				)}
			</div>
		</main>
	);
}
