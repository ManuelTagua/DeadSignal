export const PASSWORD_FRAGMENT_ID = "Chats:encrypted-fragment-01";
export const PASSWORD_FRAGMENT_CODE = "KNOCK-3";

export const VIRTUAL_DOCUMENTS = [
	{
		virtualId: "server-room-audio-transcript",
		titleKey: "files.serverRoomAudioTranscript.title",
		title: "Server Room Audio Transcript",
		category: "Recovered",
		classification: "Recovered",
		author: "DeadSignal Indexer",
		contentKey: "files.serverRoomAudioTranscript.content",
		tags: "server room,audio,pattern",
		createdAt: "2041-10-09T03:23:00.000Z",
		isFlagged: true,
		unlockTag: "server-room-knock-pattern",
		evidenceTags: ["server-room-knock-pattern", "encrypted-fragment-password-hint"]
	},
	{
		virtualId: "east-archive-access-map",
		titleKey: "files.eastArchiveAccessMap.title",
		title: "East Archive Access Map",
		category: "Recovered",
		classification: "Restricted",
		author: "Facility Cartography Cache",
		contentKey: "files.eastArchiveAccessMap.content",
		tags: "east archive,map,access",
		createdAt: "2041-10-09T03:31:00.000Z",
		isFlagged: true,
		unlockTag: "east-archive-breach",
		evidenceTags: ["east-archive-breach", "access-map"]
	},
	{
		virtualId: "relay-failure-report",
		titleKey: "files.relayFailureReport.title",
		title: "Relay Failure Report",
		category: "Report",
		classification: "Restricted",
		author: "Uplink Core",
		contentKey: "files.relayFailureReport.content",
		tags: "relay,blackout,uplink",
		createdAt: "2041-10-09T03:42:00.000Z",
		isFlagged: true,
		unlockAfterImportantLogs: 3,
		evidenceTags: ["blackout-source", "relay-failure"]
	}
];

export const VIRTUAL_CHATS = [
	{
		virtualId: "encrypted-fragment-01",
		titleKey: "files.encryptedFragment01.title",
		title: "Encrypted Fragment 01",
		channel: "encrypted-fragment-01",
		category: "Encrypted Chat",
		sentAt: "2041-10-09T03:35:00.000Z",
		isEncrypted: true,
		passwordProtected: true,
		password: PASSWORD_FRAGMENT_CODE,
		evidenceTags: ["encrypted-fragment-recovered", "blackout-source"],
		messages: [
			{
				id: "encrypted-fragment-01-a",
				sender: "Unknown",
				handle: "redacted",
				messageKey: "files.encryptedFragment01.messages.first",
				sentAt: "2041-10-08T23:09:13.000Z",
				sequence: 1,
				isEncrypted: false
			},
			{
				id: "encrypted-fragment-01-b",
				sender: "Elias Ren",
				handle: "e.ren",
				messageKey: "files.encryptedFragment01.messages.second",
				sentAt: "2041-10-08T23:10:02.000Z",
				sequence: 2,
				isEncrypted: false
			}
		]
	}
];
