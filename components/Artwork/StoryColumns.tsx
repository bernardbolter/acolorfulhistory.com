interface StoryColumnsProps {
  olderStory?: string
  newerStory?: string
}

function storyHasText(html?: string) {
  if (!html) return false
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim().length > 0
}

export default function StoryColumns({ olderStory, newerStory }: StoryColumnsProps) {
  const hasOlder = storyHasText(olderStory)
  const hasNewer = storyHasText(newerStory)

  return (
    <section className="story-columns" aria-label="Stories">
      <article className="story-column">
        <h2 className="story-column-heading">The Photograph</h2>
        {hasOlder ? (
          <div
            className="story-column-body"
            dangerouslySetInnerHTML={{ __html: olderStory as string }}
          />
        ) : (
          <p className="story-column-empty">Not yet catalogued</p>
        )}
      </article>
      <article className="story-column">
        <h2 className="story-column-heading">The Painting</h2>
        {hasNewer ? (
          <div
            className="story-column-body"
            dangerouslySetInnerHTML={{ __html: newerStory as string }}
          />
        ) : (
          <p className="story-column-empty">Not yet catalogued</p>
        )}
      </article>
    </section>
  )
}
