import { createContext } from 'react'
import { ClientApp } from '@codeblitzjs/ide-sumi-core'

export const AppContext = createContext<{
  app: ClientApp | null,
  startState?: { status: 'loading' | 'success' | 'error', error?: string }
}>({ app: null })
