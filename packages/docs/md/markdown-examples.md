# pear-rec 例子

![An image](./assets/imgs/logo.png)
本页展示 pear-rec 的一些功能例子

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## react

https://stackblitz.com/edit/vite-dnqmyv?file=package.json

```
<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import FooBar from './FooBar'

const el = ref()
onMounted(() => {
  const root = createRoot(el.value)
  root.render(createElement(FooBar, {}, null))
})
</script>
```

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
