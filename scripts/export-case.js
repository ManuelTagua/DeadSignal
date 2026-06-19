import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";

const adapter = new PrismaBetterSqlite3({
	url: process.env.DATABASE_URL ?? "file:./dev.db"
});

const prisma = new PrismaClient({ adapter });

const caseFile = await prisma.case.findUnique({
	where: { slug: "the-helix-incident" },
	include: {
		emails: {
			orderBy: { order: "asc" }
		},
		chats: {
			orderBy: [{ channel: "asc" }, { sequence: "asc" }]
		},
		documents: {
			orderBy: { createdAt: "desc" }
		},
		media: {
			orderBy: { capturedAt: "desc" }
		},
		logs: {
			orderBy: { occurredAt: "desc" }
		}
	}
});

if (!caseFile) {
	console.error("No case found.");
	process.exit(1);
}

fs.mkdirSync("src/lib/data", { recursive: true });

fs.writeFileSync(
	"src/lib/data/case-file.json",
	JSON.stringify(caseFile, null, 2),
	"utf-8"
);

await prisma.$disconnect();

console.log("Case exported to src/lib/data/case-file.json");