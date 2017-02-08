<template>
  <div :style="{top: cursor.position.top + 'px', left: cursor.position.left +'px'}">
    <mdl-tooltip :target="'carret'+cursor.sessionId">
      {{ cursor.collaboratorName }}
    </mdl-tooltip>
    <div class="carret" :id="'carret'+cursor.sessionId" :style="{backgroundColor: cursor.color}">
    </div>
  </div>
</template>

<script>
  export default {
    props: ['cursor']
  }
</script>

<style scoped>
  .carret {
    position: absolute;
    width: 2px;
    height: 20px;
    margin-top: -2px;
  }
</style>
