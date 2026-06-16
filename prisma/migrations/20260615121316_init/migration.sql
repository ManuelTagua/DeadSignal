-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "threatLevel" TEXT NOT NULL DEFAULT 'ELEVATED',
    "openedAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "emails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "toName" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "folder" TEXT NOT NULL DEFAULT 'Inbox',
    "sentAt" DATETIME NOT NULL,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "emails_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL,
    "sequence" INTEGER NOT NULL,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "chats_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "classification" TEXT NOT NULL DEFAULT 'Internal',
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "documents_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "capturedAt" DATETIME NOT NULL,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "media_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL,
    CONSTRAINT "logs_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "cases_slug_key" ON "cases"("slug");
