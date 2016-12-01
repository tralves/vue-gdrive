<template>

	<div class="demo-avatar-dropdown">
    <img class='avatar' v-bind:src="user.image"/>
  	<span>{{ user.email }}</span>
  	<button id="accbtn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
  	  <i class="material-icons" role="presentation">arrow_drop_down</i>
  	  <span class="visuallyhidden">Accounts</span>
  	</button>
  	<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="accbtn">
  	  <li class="mdl-menu__item">logout</li>
  	</ul>
  </div>
</template>

<script>
import user from '../../stores/user'

export default {
  data () {
    return {
      user: user.state
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/globals';
.avatar {
	width: 28px;
	height: 28px;
	border-radius: 16px;
	border: 3px solid $secondary-color;
	margin-right: 10px;
}
</style>

