define([], function () {
    //v16 here
    var CustomWidget = function (widget) {
        var self = widget;
        var config = widget.config;
        var widgetCode = self.get_settings().widget_code;
        var buttonId = widgetCode + config.OPEN_BUTTON_SFX;


        async function postData(url = '', data = {}) {
            // self.crm_post(url, data, cb);
            return fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            })
                .then(response => response.json()); // response.json() parses JSON response into native Javascript objects 
        }

        async function getData(url) {
            return fetch(url, {
                method: 'GET',
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            }).then(response => { 
                if(response.status == 200) return response.json();
                return null; 
            });
        }

        async function getContactInfo(lead_info){
            return (lead_info.contacts && lead_info.contacts._links && lead_info.contacts._links.self.href) 
            ? getData(lead_info.contacts._links.self.href) 
            : null;
        }

        async function getCompanyInfo(lead_info){
            return (lead_info.company && lead_info.company._links && lead_info.company._links.self.href) 
            ? getData(lead_info.contacts._links.self.href) 
            : null;
        }

        this.callbacks = {
            render: function () {
                // .then(data => console.log('data', data)) 
                // .catch(error => console.error('error', error));

                const currentLeadExists = () => (self.system().area === 'lcard' && !!AMOCRM.data.current_card && AMOCRM.data.current_card.id);
                const render_amo_template = (template_name, params) => self.render({ ref: '/tmpl/controls/' + template_name + '.twig' }, params);

                if (currentLeadExists()) {
                    const data = render_amo_template('button', {
                        text: 'Открыть',
                        class_name: widgetCode.replace(/_/g, '-') + config.OPEN_BUTTON_SFX,
                        id: buttonId
                    })
                    self.render_template({
                        caption: { class_name: widgetCode.replace(/_/g, '-') + config.WIDGET_CAPTION_SFX },
                        body: data,
                        render: ''
                    })
                    return true
                }
                return false
            },

            bind_actions: function () {
                var data = '<iframe style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" src="' + config.address + '"></iframe>';
                $('#' + buttonId).on('click', async function () {
                    var current_lead_id = AMOCRM.data.current_card.id;
                    console.log('posting...');
                    var data = await postData('https://cors-anywhere.herokuapp.com/https://webhook.site/6e9d2ff1-12d8-4034-b443-020efbf213ae', { answer: 42 })
                    console.log('data::', data);
                    var lead_info = await getData('/api/v2/leads?id=' + current_lead_id);
                    if(lead_info){
                        const li = lead_info._embedded.items[0];
                        console.log('lead_info::', li);
                        var companyInfo = await getCompanyInfo(li);
                        var contactsInfo = await getContactInfo(li);
                           
                        if(!companyInfo && !contactsInfo){
                            alert('Необходимо добавить хотя бы один контакт/компанию к сделке');
                            return true;
                        } 
                        
                        console.log('contacts:', contactsInfo);
                        console.log('company:', companyInfo);
                    }
                    // var h = document.documentElement.clientHeight - 60 - 48;
                    // var w = document.documentElement.clientWidth - 60 - 24;
                    // config.create_modal(data, w, h);
                })
                return true;
            },

            init: function () { return true; },
        };
        return this;
    };
    return CustomWidget;
});
