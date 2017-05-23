<template>
  <page>
    <div class="c-show">
      <show-cover></show-cover>
      <show-earth></show-earth>
    </div>
  </page>
</template>

<script>
import '@/assets/css/show.css'
import Page from '@/components/Page'
import ShowCover from '@/components/show/Cover'
import ShowEarth from '@/components/show/Earth'

export default {
  components: {
    'page': Page,
    'show-cover': ShowCover,
    'show-earth': ShowEarth
  }
}
</script>
