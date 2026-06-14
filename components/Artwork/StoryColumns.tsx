interface StoryColumnsProps {
  olderStory?: string
  newerStory?: string
}

export default function StoryColumns({ olderStory, newerStory }: StoryColumnsProps) {
  if (!olderStory && !newerStory) return null

  return (
    <div className="story-columns">
      {olderStory && (
        <div
          className="story-column"
          dangerouslySetInnerHTML={{ __html: olderStory }}
        />
      )}
      {newerStory && (
        <div
          className="story-column"
          dangerouslySetInnerHTML={{ __html: newerStory }}
        />
      )}
    </div>
  )
}
