import Link from "next/link";

export default function HomePage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "2rem",
				flexDirection: "column",
			}}
		>
			<h1>Maison Visio</h1>

			<Link href="/call">
				Appeler la maison
			</Link>

			<Link href="/parents">
				Mode maison
			</Link>
		</main>
	);
}
