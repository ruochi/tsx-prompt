import { h, renderToString } from '../../src/index'
import { SystemPrompt } from './SystemPrompt'
import { UserPrompt, type UserPromptInput } from './UserPrompt'

export interface ScenePromptInput extends UserPromptInput {
  sceneDesc: string
  theme: string
}

export function buildPrompt(input: ScenePromptInput) {
  return {
    system: renderToString(h(SystemPrompt, null)),
    user: renderToString(h(UserPrompt, { input })),
  }
}
