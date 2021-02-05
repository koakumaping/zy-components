import React from 'react'
import useKeeper from '@/hooks/useKeeper'

interface Prop {
  name: string
  children: React.ReactNode
}

const auth: React.FC<Prop> = (prop) => {
  const { P } = useKeeper()
  return (
    P(prop.name) ? <>{ prop.children }</> : null
  )
}

export default auth