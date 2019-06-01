define([], function (config) {
  //v3 here
  var CustomWidget = function (widget) {
    var self = widget;
    var config = widget.config;

		this.callbacks = {
			render: function () {
				const render_amo_template = (template_name, params) => {
					return self.render({ ref: '/tmpl/controls/' + template_name + '.twig' }, params);
				}

				if (self.system().area === 'lcard' && !!AMOCRM.data.current_card && AMOCRM.data.current_card.id) {
					const data = render_amo_template('button', {
						text: 'Открыть',
						class_name: config.widgetCode.replace(/_/g, '-') + config.OPEN_BUTTON_SFX,
						id: config.widgetCode + config.OPEN_BUTTON_SFX
					})
					self.render_template({
						caption: {
							class_name: config.widgetCode.replace(/_/g, '-') + config.WIDGET_CAPTION_SFX
						},
						body: data,
						render: '' //data
					})
					return true
				}
				return false
			},
			init: function () {
				return true;
			},
			bind_actions: function () {
				var data = '<iframe style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" src="' + config.address + '"></iframe>';
				const button = $('#' + config.widgetCode + config.OPEN_BUTTON_SFX)
				button.on('click', function () {
					var h = document.documentElement.clientHeight - 60 - 48;
					var w = document.documentElement.clientWidth - 60 - 24;
					config.create_modal(data, w, h);
				})
				return true;
			},
			
		};
		return this;
	};

	return CustomWidget;
});
