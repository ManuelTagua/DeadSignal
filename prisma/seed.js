import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
	url: process.env.DATABASE_URL ?? "file:./dev.db"
});

const prisma = new PrismaClient({ adapter });

const caseSlug = "the-helix-incident";

const emails = [
	{
		fromName: "Dr. Mara Voss",
		fromEmail: "m.voss@helixlabs.internal",
		toName: "Elias Ren",
		toEmail: "e.ren@helixlabs.internal",
		subject: "Containment review moved to 23:40",
		body:
			"Elias,\n\nThe board wants a clean incident summary before the morning call. Keep the language operational. Do not mention the east archive breach until we know whether the door logs are corrupt or altered.\n\nIf anyone asks about the silence from sublevel C, route it through me.\n\nMara",
		folder: "Inbox",
		sentAt: new Date("2041-10-08T21:16:00.000Z"),
		isFlagged: true,
		order: 1
	},
	{
		fromName: "Elias Ren",
		fromEmail: "e.ren@helixlabs.internal",
		toName: "Dr. Mara Voss",
		toEmail: "m.voss@helixlabs.internal",
		subject: "Re: Containment review moved to 23:40",
		body:
			"Mara,\n\nI can make the report look routine, but the access pattern is not routine. Someone authenticated as Kade from a terminal that has been offline since July.\n\nSecurity cameras show static at the exact same minute.\n\nElias",
		folder: "Sent",
		sentAt: new Date("2041-10-08T21:29:00.000Z"),
		isFlagged: true,
		order: 2
	},
	{
		fromName: "Internal Dispatch",
		fromEmail: "dispatch@helixlabs.internal",
		toName: "All Facility Staff",
		toEmail: "staff@helixlabs.internal",
		subject: "Network maintenance window",
		body:
			"Scheduled maintenance will begin at 23:00 and may interrupt external communication. Local systems should remain available. Report unusual device behavior to Security Operations.",
		folder: "Announcements",
		sentAt: new Date("2041-10-08T19:45:00.000Z"),
		isFlagged: false,
		order: 3
	},
	{
		fromName: "Noah Kade",
		fromEmail: "n.kade@helixlabs.internal",
		toName: "Security Operations",
		toEmail: "secops@helixlabs.internal",
		subject: "Badge rejected at west service gate",
		body:
			"My badge failed twice at west service. The console says I am already inside the facility. I am not. I left at 18:12 and am writing this from home.\n\nPlease check for a duplicate credential.",
		folder: "Security",
		sentAt: new Date("2041-10-08T20:02:00.000Z"),
		isFlagged: true,
		order: 4
	}
];

const chats = [
	{
		channel: "ops-night-shift",
		sender: "Iris Vale",
		handle: "iris.v",
		message: "Anyone else seeing the internal map flicker between floors?",
		sentAt: new Date("2041-10-08T22:48:10.000Z"),
		sequence: 1,
		isEncrypted: false
	},
	{
		channel: "ops-night-shift",
		sender: "Jon Bell",
		handle: "jbell",
		message: "Yes. Sublevel C keeps showing as unoccupied, then full occupancy, then offline.",
		sentAt: new Date("2041-10-08T22:49:02.000Z"),
		sequence: 2,
		isEncrypted: false
	},
	{
		channel: "ops-night-shift",
		sender: "Iris Vale",
		handle: "iris.v",
		message: "Do not go down there. The elevator just accepted a call without anyone pressing it.",
		sentAt: new Date("2041-10-08T22:51:43.000Z"),
		sequence: 3,
		isEncrypted: false
	},
	{
		channel: "private-thread-7",
		sender: "Unknown",
		handle: "redacted",
		message: "[encrypted fragment] HELIX IS NOT A LAB. IT IS A LOCK.",
		sentAt: new Date("2041-10-08T23:03:19.000Z"),
		sequence: 4,
		isEncrypted: true
	},
	{
		channel: "private-thread-7",
		sender: "Elias Ren",
		handle: "e.ren",
		message: "Who are you? How did you get into this channel?",
		sentAt: new Date("2041-10-08T23:04:11.000Z"),
		sequence: 5,
		isEncrypted: true
	}
];

const documents = [
	{
		title: "Initial Incident Brief",
		category: "Report",
		classification: "Internal",
		author: "Elias Ren",
		content:
			"At 23:17 local facility time, Helix Labs stopped responding to all external communication attempts. Network telemetry shows a gradual degradation rather than a single outage. Internal authentication remained active for nine minutes after the external blackout.\n\nOpen questions: why did credential N-KADE-17 authenticate from an offline terminal, and why were occupancy sensors overwritten in sublevel C?",
		tags: "incident,communications,blackout",
		createdAt: new Date("2041-10-09T01:20:00.000Z"),
		isFlagged: true
	},
	{
		title: "Security Note: East Archive",
		category: "Note",
		classification: "Restricted",
		author: "Mara Voss",
		content:
			"The east archive door should remain sealed until biometric records can be manually verified. If the door log is accurate, someone opened it from both sides within the same second.",
		tags: "east archive,door logs,biometric",
		createdAt: new Date("2041-10-08T22:12:00.000Z"),
		isFlagged: true
	},
	{
		title: "Employee Roster Delta",
		category: "Internal Memo",
		classification: "Internal",
		author: "Human Systems",
		content:
			"Night shift roster lists 43 employees onsite. Badge telemetry lists 44. One unknown credential appears only as SIGNAL-000 and has no matching personnel record.",
		tags: "roster,badge,signal-000",
		createdAt: new Date("2041-10-08T23:08:00.000Z"),
		isFlagged: false
	},
	{
		title: "Recovered Sticky Note",
		category: "Note",
		classification: "Unverified",
		author: "Unknown",
		content:
			"Three knocks from the server room. One reply from the wall. The lights know before we do.",
		tags: "recovered,server room",
		createdAt: new Date("2041-10-09T02:02:00.000Z"),
		isFlagged: false
	}
];

const media = [
	{
		title: "Sublevel C Camera 03",
		type: "Image",
		url: "/media/sublevel-c-camera.svg",
		caption: "Last intact frame before static consumed the feed.",
		source: "cam-03-sublevel-c",
		capturedAt: new Date("2041-10-08T23:16:40.000Z"),
		isFlagged: true
	},
	{
		title: "East Archive Door",
		type: "Image",
		url: "/media/east-archive-door.svg",
		caption: "Door sensor reports open and sealed states simultaneously.",
		source: "security-still-east-archive",
		capturedAt: new Date("2041-10-08T22:58:04.000Z"),
		isFlagged: true
	},
	{
		title: "Network Map Snapshot",
		type: "Image",
		url: "/media/network-map.svg",
		caption: "External links drop in a spiral pattern around core node H-0.",
		source: "netops-capture",
		capturedAt: new Date("2041-10-08T23:17:12.000Z"),
		isFlagged: false
	}
];

const logs = [
	{
		level: "INFO",
		source: "auth-gateway",
		code: "AUTH-102",
		message: "Login detected: n.kade from terminal C-17.",
		occurredAt: new Date("2041-10-08T22:56:31.000Z")
	},
	{
		level: "WARN",
		source: "door-control",
		code: "DOOR-441",
		message: "East archive access event contains conflicting direction vectors.",
		occurredAt: new Date("2041-10-08T22:58:04.000Z")
	},
	{
		level: "ERROR",
		source: "camera-grid",
		code: "CAM-500",
		message: "Unauthorized access detected. Camera packet integrity failed.",
		occurredAt: new Date("2041-10-08T23:03:19.000Z")
	},
	{
		level: "CRITICAL",
		source: "uplink-core",
		code: "NET-900",
		message: "Connection lost to Helix Labs external relay.",
		occurredAt: new Date("2041-10-08T23:17:00.000Z")
	},
	{
		level: "WARN",
		source: "occupancy-sensor",
		code: "OCC-204",
		message: "Sublevel C occupancy changed from 0 to 44 without door movement.",
		occurredAt: new Date("2041-10-08T23:17:39.000Z")
	},
	{
		level: "INFO",
		source: "dead-signal-shell",
		code: "SYS-001",
		message: "Recovered case index mounted in read-only mode.",
		occurredAt: new Date("2041-10-09T03:12:12.000Z")
	}
];

async function main() {
	const existing = await prisma.case.findUnique({
		where: { slug: caseSlug }
	});

	if (existing) {
		await prisma.case.delete({
			where: { id: existing.id }
		});
	}

	await prisma.case.create({
		data: {
			slug: caseSlug,
			title: "The Helix Incident",
			description:
				"Helix Labs lost all communication with its employees after a staged maintenance window. The remaining system image contains emails, chats, files, media captures, and logs that suggest the blackout was deliberate.",
			status: "ACTIVE",
			threatLevel: "ELEVATED",
			openedAt: new Date("2041-10-09T03:12:00.000Z"),
			emails: { create: emails },
			chats: { create: chats },
			documents: { create: documents },
			media: { create: media },
			logs: { create: logs }
		}
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log("Seeded The Helix Incident.");
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
