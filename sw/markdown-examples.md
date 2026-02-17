# Mifano ya Viendelezi vya Markdown

Ukurasa huu unaonyesha baadhi ya viendelezi vya markdown vilivyojengwa ndani ya VitePress.

## Uangaziaji wa Sintaksia

VitePress hutoa Uangaziaji wa Sintaksia unaotumia [Shiki](https://github.com/shikijs/shiki), pamoja na vipengele vya ziada kama uangaziaji wa mistari:

**Ingizo**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Imeangaziwa!'
    }
  }
}
```
````

**Matokeo**

```js{4}
export default {
  data () {
    return {
      msg: 'Imeangaziwa!'
    }
  }
}
```

## Vyombo Maalum

**Ingizo**

```md
::: info
Hii ni sanduku la taarifa.
:::

::: tip
Hii ni kidokezo.
:::

::: warning
Hii ni onyo.
:::

::: danger
Hii ni onyo la hatari.
:::

::: details
Hii ni sehemu ya maelezo.
:::
```

**Matokeo**

::: info
Hii ni sanduku la taarifa.
:::

::: tip
Hii ni kidokezo.
:::

::: warning
Hii ni onyo.
:::

::: danger
Hii ni onyo la hatari.
:::

::: details
Hii ni sehemu ya maelezo.
:::

## Zaidi

Angalia nyaraka kwa [orodha kamili ya viendelezi vya markdown](https://vitepress.dev/guide/markdown).
