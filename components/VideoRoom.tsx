"use client";

import { useEffect, useState } from "react";
import { Room, RoomEvent } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import RoomView from "./RoomView";

interface VideoRoomProps {
	identity: "parents" | "family";
}

export default function VideoRoom({
	identity,
}: VideoRoomProps) {
	const [room] = useState(() => new Room());
	const [connected, setConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function connect() {
			try {
				const response = await fetch("/api/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						identity,
					}),
				});

				if (!response.ok) {
					throw new Error("Impossible de récupérer le token");
				}

				const data = await response.json();

				if (cancelled) {
					return;
				}

				const handleConnected = () => {
					if (!cancelled) {
						setConnected(true);
					}
				};

				const handleDisconnected = () => {
					if (!cancelled) {
						setConnected(false);
					}
				};

				room.on(
					RoomEvent.Connected,
					handleConnected,
				);

				room.on(
					RoomEvent.Disconnected,
					handleDisconnected,
				);

				await room.connect(
					data.serverUrl,
					data.token,
				);

				if (cancelled) {
					return;
				}

				await room.localParticipant
					.enableCameraAndMicrophone();
			} catch (err) {
				console.error(err);

				if (!cancelled) {
					setError(
						err instanceof Error
							? err.message
							: "Erreur de connexion",
					);
				}
			}
		}

		connect();

		return () => {
			cancelled = true;

			room.disconnect();
		};
	}, [identity, room]);

	async function hangUp() {
		await room.localParticipant
			.setCameraEnabled(false);

		await room.localParticipant
			.setMicrophoneEnabled(false);

		room.disconnect();
	}

	if (error) {
		return (
			<div className="status-screen">
				<h1>Erreur</h1>
				<p>{error}</p>
			</div>
		);
	}

	if (!connected) {
		return (
			<div className="status-screen">
				<p>Connexion à la visio...</p>
			</div>
		);
	}

	return (
		<RoomContext.Provider value={room}>
			<div className="video-page">
				<RoomView localIdentity={identity} />

				<button
					onClick={hangUp}
					className="hangup-button"
				>
					Raccrocher
				</button>
			</div>
		</RoomContext.Provider>
	);
}
