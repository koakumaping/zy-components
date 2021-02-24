# react components

## Getting Started

Add .npmrc for root,

```bash
$ touch .npmrc
$ echo '@zy:registry=http://172.16.5.240/' > .npmrc
```

Install dependencies,

```bash
$ yarn add @zy/components-react
$ npm install @zy/components-react
```

Change umi setting in .umirc.ts,

```js
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
    exclude: ['evian', '@zy/components-react'],
  },
})
```

Use,
```js
import React from 'react'
import { ZyLogin } from '@zy/components-react'

const Login :React.FC = () => {
  return (
    <ZyLogin />
  )
}
```