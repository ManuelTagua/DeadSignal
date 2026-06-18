export const MIRROR_PROJECT_CASE_FILE = {
	id: "project-mirror",
	title: "Proyecto MIRROR",
	description:
		"The blackout was only cover. The recovered archive now points to MIRROR, an internal Helix project that kept answering after the incident.",
	status: "ACTIVE",
	threatLevel: "ELEVATED",
	documents: [
		{
			id: "mirror-charter-fragment",
			titleKey: "mirror.documents.charter.title",
			title: "MIRROR Charter Fragment",
			category: "Internal Memo",
			classification: "Restricted",
			author: "Helix Ethics Office",
			contentKey: "mirror.documents.charter.content",
			tags: "mirror,charter,behavioral profiles",
			createdAt: "2041-10-09T04:06:00.000Z",
			isFlagged: true,
			evidenceTags: ["mirror-manifest-core"]
		},
		{
			id: "mirror-audit-hold",
			titleKey: "mirror.documents.auditHold.title",
			title: "Audit Retention Notice",
			category: "Report",
			classification: "Internal",
			author: "Helix Audit Committee",
			contentKey: "mirror.documents.auditHold.content",
			tags: "audit,retention,mirror",
			createdAt: "2041-10-09T04:11:00.000Z",
			isFlagged: true,
			evidenceTags: ["audit-retention-order"]
		},
		{
			id: "mirror-subject-map",
			titleKey: "mirror.documents.subjectMap.title",
			title: "MIRROR Subject Map",
			category: "Map",
			classification: "Restricted",
			author: "Behavioral Systems Archive",
			contentKey: "mirror.documents.subjectMap.content",
			tags: "mirror,subjects,map",
			createdAt: "2041-10-09T04:18:00.000Z",
			isFlagged: true,
			evidenceTags: ["mirror-subject-map", "mirror-manifest-core"]
		},
		{
			id: "mirror-r7-transfer-manifest",
			titleKey: "mirror.documents.r7Manifest.title",
			title: "R-7 Transfer Manifest",
			category: "Report",
			classification: "Restricted",
			author: "Helix Logistics",
			contentKey: "mirror.documents.r7Manifest.content",
			tags: "r-7,reflection lab,export",
			createdAt: "2041-10-09T04:24:00.000Z",
			isFlagged: true,
			evidenceTags: ["r7-transfer-manifest", "mirror-export-package", "reflection-lab-access-trace"]
		},
		{
			id: "noah-kade-offsite-statement",
			titleKey: "mirror.documents.kadeStatement.title",
			title: "Noah Kade Offsite Statement",
			category: "Note",
			classification: "Unverified",
			author: "Noah Kade",
			contentKey: "mirror.documents.kadeStatement.content",
			tags: "n-kade-17,offsite,statement",
			createdAt: "2041-10-09T04:31:00.000Z",
			isFlagged: true,
			evidenceTags: ["n-kade-offsite-statement"]
		}
	],
	emails: [
		{
			id: "mirror-email-containment",
			fromName: "Mara Voss",
			fromEmail: "m.voss@helix.local",
			toName: "Elias Ren",
			toEmail: "e.ren@helix.local",
			subjectKey: "mirror.emails.containment.subject",
			subject: "Containment is no longer enough",
			bodyKey: "mirror.emails.containment.body",
			body: "",
			folder: "Security",
			sentAt: "2041-10-09T04:13:00.000Z",
			isFlagged: true,
			evidenceTags: ["mirror-admin-token"]
		},
		{
			id: "mirror-email-answering",
			fromName: "Elias Ren",
			fromEmail: "e.ren@helix.local",
			toName: "Mara Voss",
			toEmail: "m.voss@helix.local",
			subjectKey: "mirror.emails.answering.subject",
			subject: "MIRROR is still answering",
			bodyKey: "mirror.emails.answering.body",
			body: "",
			folder: "Inbox",
			sentAt: "2041-10-09T04:19:00.000Z",
			isFlagged: true,
			evidenceTags: ["mirror-live-sync"]
		},
		{
			id: "mirror-email-r7-ticket",
			fromName: "I. Rourke",
			fromEmail: "i.rourke@helix.local",
			toName: "Security Operations",
			toEmail: "security.ops@helix.local",
			subjectKey: "mirror.emails.r7Ticket.subject",
			subject: "No maintenance ticket for R-7",
			bodyKey: "mirror.emails.r7Ticket.body",
			body: "",
			folder: "Security",
			sentAt: "2041-10-09T04:26:00.000Z",
			isFlagged: true,
			evidenceTags: ["reflection-lab-access-trace"]
		},
		{
			id: "mirror-email-preservation",
			fromName: "Helix Audit Committee",
			fromEmail: "audit.committee@helix.local",
			toName: "Mara Voss",
			toEmail: "m.voss@helix.local",
			subjectKey: "mirror.emails.preservation.subject",
			subject: "Preservation hold active",
			bodyKey: "mirror.emails.preservation.body",
			body: "",
			folder: "Announcements",
			sentAt: "2041-10-09T04:34:00.000Z",
			isFlagged: true,
			evidenceTags: ["audit-retention-order"]
		}
	],
	chats: [
		{
			id: "mirror-chat-security-1",
			channel: "security-night",
			threadTitleKey: "mirror.chats.securityNight.title",
			sender: "Iris Vale",
			handle: "i.vale",
			messageKey: "mirror.chats.securityNight.messages.first",
			sentAt: "2041-10-09T04:17:00.000Z",
			sequence: 1,
			isEncrypted: false,
			evidenceTags: ["reflection-lab-access-trace"]
		},
		{
			id: "mirror-chat-security-2",
			channel: "security-night",
			threadTitleKey: "mirror.chats.securityNight.title",
			sender: "Jon Bell",
			handle: "j.bell",
			messageKey: "mirror.chats.securityNight.messages.second",
			sentAt: "2041-10-09T04:18:00.000Z",
			sequence: 2,
			isEncrypted: false,
			evidenceTags: ["reflection-lab-access-trace"]
		},
		{
			id: "mirror-chat-security-3",
			channel: "security-night",
			threadTitleKey: "mirror.chats.securityNight.title",
			sender: "Iris Vale",
			handle: "i.vale",
			messageKey: "mirror.chats.securityNight.messages.third",
			sentAt: "2041-10-09T04:19:00.000Z",
			sequence: 3,
			isEncrypted: false,
			evidenceTags: ["reflection-lab-access-trace"]
		},
		{
			id: "mirror-chat-archive-1",
			channel: "ops-archive",
			threadTitleKey: "mirror.chats.opsArchive.title",
			sender: "A. Ren",
			handle: "a.ren",
			messageKey: "mirror.chats.opsArchive.messages.first",
			sentAt: "2041-10-09T04:21:00.000Z",
			sequence: 1,
			isEncrypted: false,
			evidenceTags: ["mirror-export-package"]
		},
		{
			id: "mirror-chat-archive-2",
			channel: "ops-archive",
			threadTitleKey: "mirror.chats.opsArchive.title",
			sender: "Elias Ren",
			handle: "e.ren",
			messageKey: "mirror.chats.opsArchive.messages.second",
			sentAt: "2041-10-09T04:22:00.000Z",
			sequence: 2,
			isEncrypted: false,
			evidenceTags: ["mirror-export-package"]
		},
		{
			id: "mirror-chat-archive-3",
			channel: "ops-archive",
			threadTitleKey: "mirror.chats.opsArchive.title",
			sender: "A. Ren",
			handle: "a.ren",
			messageKey: "mirror.chats.opsArchive.messages.third",
			sentAt: "2041-10-09T04:23:00.000Z",
			sequence: 3,
			isEncrypted: false,
			evidenceTags: ["audit-retention-order"]
		},
		{
			id: "mirror-chat-ren-1",
			channel: "Ren-A.Ren",
			threadTitleKey: "mirror.chats.renPrivate.title",
			sender: "Elias Ren",
			handle: "e.ren",
			messageKey: "mirror.chats.renPrivate.messages.first",
			sentAt: "2041-10-09T04:28:00.000Z",
			sequence: 1,
			isEncrypted: false,
			evidenceTags: ["mirror-manifest-core"]
		},
		{
			id: "mirror-chat-ren-2",
			channel: "Ren-A.Ren",
			threadTitleKey: "mirror.chats.renPrivate.title",
			sender: "A. Ren",
			handle: "a.ren",
			messageKey: "mirror.chats.renPrivate.messages.second",
			sentAt: "2041-10-09T04:29:00.000Z",
			sequence: 2,
			isEncrypted: false,
			evidenceTags: ["audit-retention-order"]
		},
		{
			id: "mirror-chat-ren-3",
			channel: "Ren-A.Ren",
			threadTitleKey: "mirror.chats.renPrivate.title",
			sender: "Elias Ren",
			handle: "e.ren",
			messageKey: "mirror.chats.renPrivate.messages.third",
			sentAt: "2041-10-09T04:30:00.000Z",
			sequence: 3,
			isEncrypted: false,
			evidenceTags: ["n-kade-17-clone-record"]
		}
	],
	media: [],
	logs: [
		{
			id: "mirror-log-114",
			level: "WARN",
			source: "mirror-core",
			code: "MIRROR-114",
			occurredAt: "2041-10-08T22:11:00.000Z",
			isFlagged: true,
			evidenceTags: ["mirror-live-sync", "mirror-manifest-core"]
		},
		{
			id: "mirror-hold-208",
			level: "INFO",
			source: "audit-vault",
			code: "HOLD-208",
			occurredAt: "2041-10-08T21:15:00.000Z",
			isFlagged: true,
			evidenceTags: ["audit-retention-order"]
		},
		{
			id: "mirror-purge-771",
			level: "ERROR",
			source: "mirror-core",
			code: "PURGE-771",
			occurredAt: "2041-10-08T23:06:00.000Z",
			isFlagged: true,
			evidenceTags: ["mirror-admin-token", "mirror-purge-record"]
		},
		{
			id: "mirror-export-332",
			level: "WARN",
			source: "export-daemon",
			code: "EXPORT-332",
			occurredAt: "2041-10-08T22:41:00.000Z",
			isFlagged: true,
			evidenceTags: ["mirror-export-package"]
		},
		{
			id: "mirror-access-509",
			level: "WARN",
			source: "reflection-access",
			code: "ACCESS-509",
			occurredAt: "2041-10-08T22:33:00.000Z",
			isFlagged: true,
			evidenceTags: ["reflection-lab-access-trace"]
		},
		{
			id: "mirror-decoy-017",
			level: "WARN",
			source: "auth-gateway",
			code: "DECOY-017",
			occurredAt: "2041-10-08T22:55:00.000Z",
			isFlagged: true,
			evidenceTags: ["n-kade-17-clone-record"]
		}
	]
};
