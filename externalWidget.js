define(['./test.js'], function (test) {
  //v4 here
  var CustomWidget = function (widget) {
    var self = widget;
    var config = widget.config;
    var buttonId = config.widgetCode + config.OPEN_BUTTON_SFX; 
    
		this.callbacks = {
			render: function () {
        console.log('TEST:::', test);
        const currentLeadExists = () => (self.system().area === 'lcard' && !!AMOCRM.data.current_card && AMOCRM.data.current_card.id);
        const render_amo_template = (template_name, params) => self.render({ ref: '/tmpl/controls/' + template_name + '.twig' }, params);

				if (currentLeadExists()) {
					const data = render_amo_template('button', {
						text: 'Открыть',
						class_name: config.widgetCode.replace(/_/g, '-') + config.OPEN_BUTTON_SFX,
						id: buttonId
					})
					self.render_template({
						caption: { class_name: config.widgetCode.replace(/_/g, '-') + config.WIDGET_CAPTION_SFX	},
						body: data,
						render: ''
					})
					return true
				}
				return false
			},
			
			bind_actions: function () {
				var data = '<iframe style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" src="' + config.address + '"></iframe>';
				$('#' + buttonId).on('click', function () {
					var h = document.documentElement.clientHeight - 60 - 48;
					var w = document.documentElement.clientWidth - 60 - 24;
					config.create_modal(data, w, h);
				})
				return true;
      },

      init: function () { return true; },
		};
		return this;
	};
	return CustomWidget;
});
