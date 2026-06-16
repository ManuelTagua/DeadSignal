import { prisma } from "$lib/server/db";

export async function load() {
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

	return {
		caseFile: caseFile ? JSON.parse(JSON.stringify(caseFile)) : null
	};
}
