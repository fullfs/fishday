(function() {
	var Project = {
		extend: function(obj) {
			var proto = function($el, config) {
				this.$el = $el;
				this.config = config || {};

				if (this.$el && this.$el.length) {
					if (this.init) {
						this.init();
					} else {
						console.log('Framework error: cant find .init method')
					}
				} else {
					
				}
			};
			proto.prototype = $.extend({
				$: function(selector) {
					return this.$el.find(selector);
				}
			}, obj);
			return proto;
		},

		Blocks: {
			
		},

		Pages: {

		},

		Utils: {
			
		}
	};

	this.Project = Project;
})(window);