<script>
	import { NotebookText, Pencil, Plus, Save, Tags, Trash2, X } from "@lucide/svelte";
	import { createNote, deleteNote, updateNote } from "$lib/stores/InvestigationStore";
	import { t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let { notes = [], chapterId = "chapter-1" } = $props();

	let draftBody = $state("");
	let draftTags = $state("");
	let editingNoteId = $state(/** @type {string | null} */ (null));
	const isEditing = $derived(Boolean(editingNoteId));

	/** @param {SubmitEvent} event */
	function submitNote(event) {
		event.preventDefault();

		const payload = {
			body: draftBody,
			tags: parseTags(draftTags)
		};

		if (isEditing && editingNoteId) {
			if (updateNote(editingNoteId, payload, chapterId)) resetDraft();
			return;
		}

		if (createNote(payload, chapterId)) resetDraft();
	}

	/** @param {Record<string, any>} note */
	function editNote(note) {
		editingNoteId = note.id;
		draftBody = note.body;
		draftTags = note.tags.join(", ");
	}

	/** @param {string} noteId */
	function removeNote(noteId) {
		deleteNote(noteId, chapterId);
		if (editingNoteId === noteId) resetDraft();
	}

	function resetDraft() {
		draftBody = "";
		draftTags = "";
		editingNoteId = null;
	}

	/** @param {string} value */
	function parseTags(value) {
		return value
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
	}
</script>

<section class="grid gap-4 xl:grid-cols-[minmax(0,360px)_1fr]">
	<form class="grid content-start gap-3 rounded border border-cyan-300/15 bg-black/25 p-3" onsubmit={submitNote}>
		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
				<NotebookText size={13} />
				<span>{$t("notes.title")}</span>
			</div>
			{#if isEditing}
				<button
					type="button"
					class="flex h-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] px-2 text-white/55 hover:border-cyan-300/25 hover:text-white"
					aria-label={$t("notes.cancelEdit")}
					onclick={resetDraft}
				>
					<X size={14} />
				</button>
			{/if}
		</div>

		<label class="grid gap-2">
			<span class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("notes.fields.body")}</span>
			<textarea
				class="min-h-[180px] resize-y rounded border border-cyan-300/20 bg-black/45 p-3 text-sm leading-6 text-cyan-50 outline-none placeholder:text-white/30 focus:border-cyan-200/70"
				bind:value={draftBody}
				placeholder={$t("notes.placeholders.body")}
			></textarea>
		</label>

		<label class="grid gap-2">
			<span class="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
				<Tags size={13} />
				{$t("notes.fields.tags")}
			</span>
			<input
				class="h-10 rounded border border-cyan-300/20 bg-black/45 px-3 text-sm text-cyan-50 outline-none placeholder:text-white/30 focus:border-cyan-200/70"
				bind:value={draftTags}
				placeholder={$t("notes.placeholders.tags")}
				autocomplete="off"
			/>
		</label>

		<button
			type="submit"
			class="flex h-10 items-center justify-center gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
		>
			{#if isEditing}
				<Save size={14} />
				{$t("notes.actions.save")}
			{:else}
				<Plus size={14} />
				{$t("notes.actions.create")}
			{/if}
		</button>
	</form>

	<div class="grid content-start gap-3">
		{#each notes as note (note.id)}
			<article class="rounded border border-white/10 bg-black/25 p-3">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{formatTimestamp(note.updatedAt)}</p>
						<p class="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/35">
							{$t("notes.created")} {formatTimestamp(note.createdAt)}
						</p>
					</div>
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="flex h-8 w-8 items-center justify-center rounded border border-cyan-300/20 bg-cyan-300/5 text-cyan-50 hover:border-cyan-200/60"
							aria-label={$t("notes.actions.edit")}
							onclick={() => editNote(note)}
						>
							<Pencil size={14} />
						</button>
						<button
							type="button"
							class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-white/55 hover:border-cyan-300/25 hover:text-white"
							aria-label={$t("notes.actions.delete")}
							onclick={() => removeNote(note.id)}
						>
							<Trash2 size={14} />
						</button>
					</div>
				</div>
				<p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/70">{note.body}</p>
				{#if note.tags.length}
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each note.tags as tag}
							<span class="rounded border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-50">
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</article>
		{:else}
			<div class="grid min-h-[260px] place-items-center rounded border border-white/10 bg-black/25 p-6 text-center">
				<div>
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-50">
						<NotebookText size={20} />
					</div>
					<h3 class="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">{$t("notes.empty")}</h3>
				</div>
			</div>
		{/each}
	</div>
</section>
