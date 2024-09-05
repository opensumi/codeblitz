import { createContext } from 'react'
import { ClientApp } from '@codeblitzjs/ide-sumi-core'

export const AppContext = createContext<{ app: ClientApp | null }>({ app: null })
