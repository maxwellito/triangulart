Vue.component('launcher', {
	props: ['foo'],
	data: function () {
		return {
			projectsAvalable: 2
		}
	},
  template: '\
	  <div class="launcher grid">\
	    <div class="row">\
	      <object data="assets/triangulart_logo.svg" type="image/svg+xml" class="intro-logo"></object>\
	      <div>\
	        <h1>triangulart</h1>\
	        <p>This is a silly graphic editor build in JavaScript to create isometric illustrations.<br>Triangulart is like pixel art but for triangles.</p>\
	      </div>\
	    </div>\
	    <div class="row row-balanced">\
	      <div class="intro-selection-box">Load from a file</div>\
	      <div class="intro-selection-box">Start a new one</div>\
	      <div class="intro-selection-box">Load from previous <span class="notification-dot" v-if="projectsAvalable" :text-content.prop="projectsAvalable"></span></div>\
	    </div>\
	  </div>'
	})