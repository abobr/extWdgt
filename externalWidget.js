define(['./test.js'], function (test) {
  //v5 here
  var CustomWidget = function (widget) {
    var self = widget;
    var config = widget.config;
    var buttonId = config.widgetCode + config.OPEN_BUTTON_SFX; 
    
  
    function postData(url = '', data = {}) {
      // Default options are marked with *
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => response.json()); // parses JSON response into native Javascript objects 
    }

		this.callbacks = {
			render: function () {
        console.log('TEST:::', test);
        console.log('posting...');
        postData('https://webhook.site/6e9d2ff1-12d8-4034-b443-020efbf213ae', {answer: 42})
          .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
          .catch(error => console.error(error));
  
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
