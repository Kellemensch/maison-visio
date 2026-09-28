"use client";

import { useState } from "react";
import VideoRoom from "@/components/VideoRoom";

export default function CallPage() {
	const [authenticated, setAuthenticated] =
		useState(false);

	const [code, setCode] = useState("");

	const [loading, setLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	const [calling, setCalling] =
		useState(false);

	async function login() {
		setLoading(true);
		setError("");

		try {
			const response = await fetch(
				"/api/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						code,
					}),
				},
			);

			if (!response.ok) {
				setError("Code incorrect.");
				return;
			}

			setAuthenticated(true);
		} catch (error) {
			console.error(error);
			setError("Erreur de connexion.");
		} finally {
			setLoading(false);
		}
	}

	if (calling) {
		return (
			<VideoRoom identity="family" />
		);
	}

	if (!authenticated) {
		return (
			<main className="call-screen">
				<div className="call-card">
					<h1>Maison des parents</h1>

					<p>
						Entrez le code familial.
					</p>

					<input
						type="password"
						value={code}
						onChange={(event) =>
							setCode(event.target.value)
						}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								login();
							}
						}}
						placeholder="Code"
						autoFocus
					/>

					<button
						onClick={login}
						disabled={loading}
						className="call-button"
					>
						{loading
							? "Vérification..."
							: "Continuer"}
					</button>

					{error && (
						<p>{error}</p>
					)}
				</div>
			</main>
		);
	}

	return (
		<main className="call-screen">
			<div className="call-card">
				<h1>Maison des parents</h1>

				<p>
					Vous pouvez appeler la maison.
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
