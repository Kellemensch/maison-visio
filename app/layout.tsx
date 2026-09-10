import "./globals.css";
import "@livekit/components-styles";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Maison Visio",
	description: "Visiophone familial",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body>{children}</body>
		</html>
	);
}
