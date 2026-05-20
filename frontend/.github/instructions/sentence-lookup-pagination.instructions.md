---
description: "Use when building the sentence search/results UI in Grammify. Enforces in-page filtering by type and structure plus pagination for vertically overflowing results."
applyTo: "app/sentence-lookup/**/*.{ts,tsx,js,jsx},src/components/**/*Sentence*.*"
---
# Sentence Search Results Behavior

- When the user clicks **Search**, show only the sentences that match the selected **type** and **structure**.
- Keep the results on the same page; do not navigate to a separate results page for this interaction.
- Render the filtered sentences directly below or beside the search controls, depending on the layout.
- If the filtered results exceed the available vertical space, paginate the results so the user can move through them without the page becoming unusably long.
- Preserve the current search filters when moving between pages of results.
- Make pagination controls explicit and easy to discover, with clear previous/next actions and page indicators.
- Keep filtering logic separate from presentation so the results list and pagination remain easy to test and update.
- Prefer client-side state for the currently selected filters, page number, and visible result slice when the data set is already loaded on the page.
- If server-side paging is introduced later, keep the visible behavior the same: the search still updates the current page, and pagination still stays in-place.
