interface InstagramEmbeds {
  process(): void
}

interface InstagramAPI {
  Embeds: InstagramEmbeds
}

declare global {
  interface Window {
    instgrm?: InstagramAPI
  }
}

export {}