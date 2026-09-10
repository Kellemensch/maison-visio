"use client";

import {
	RoomAudioRenderer,
	VideoTrack,
	useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

interface RoomViewProps {
	localIdentity: string;
}

export default function RoomView({ localIdentity }: RoomViewProps) {
	const tracks = useTracks([Track.Source.Camera]);

	const remoteTracks = tracks.filter(
		(track) => track.participant.identity !== localIdentity,
	);

	const localTracks = tracks.filter(
		(track) => track.participant.identity === localIdentity,
	);

	return (
		<div className="room">
			<RoomAudioRenderer />

			<main className="remote-video">
				{remoteTracks.length > 0 ? (
					<VideoTrack
						trackRef={remoteTracks[0]}
						className="video-main"
					/>
				) : (
					<div className="waiting">
						<p>En attente de vidéo...</p>
					</div>
				)}
			</main>

			{localTracks.length > 0 && (
				<div className="local-video">
					<VideoTrack
						trackRef={localTracks[0]}
						className="video-local"
					/>
				</div>
			)}
		</div>
	);
}
