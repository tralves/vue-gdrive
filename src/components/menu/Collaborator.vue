<template>
  <div>
    <mdl-tooltip :target="collaborator.sessionId">
      {{ collaborator.displayName }}
      {{ collaborator.isMe ? "(me)" : "" }}</mdl-tooltip>
    <img :id="collaborator.sessionId" class="avatar" :style="{borderColor: collaborator.color}" :src="collaborator.photoUrl"/>
  </div>
</template>

<script>
export default {
  props: ['collaborator']
}
</script>

<style lang="scss" scoped>
@import '../../styles/globals';
.avatar {
	width: 28px;
	height: 28px;
	border-bottom: 4px solid;
	margin-right: 10px;
}
</style>
