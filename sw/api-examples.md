---
outline: deep
---

# Mifano ya Runtime API

Ukurasa huu unaonyesha matumizi ya baadhi ya Runtime API zinazotolewa na VitePress.

API kuu ya `useData()` inaweza kutumika kupata data ya tovuti, mandhari, na ukurasa kwa ukurasa wa sasa. Inafanya kazi katika faili za `.md` na `.vue`:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Matokeo

### Data ya Mandhari
<pre>{{ theme }}</pre>

### Data ya Ukurasa
<pre>{{ page }}</pre>

### Frontmatter ya Ukurasa
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Matokeo

### Data ya Mandhari
<pre>{{ theme }}</pre>

### Data ya Ukurasa
<pre>{{ page }}</pre>

### Frontmatter ya Ukurasa
<pre>{{ frontmatter }}</pre>

## Zaidi

Angalia nyaraka kwa [orodha kamili ya Runtime API](https://vitepress.dev/reference/runtime-api#usedata).
