define([], function () {
  var CustomWidget = function () {
    var self = this;
    this.callbacks = {
      render: function(){
        console.log('render--------ext');
        return true;
      },
      init: function(){
        console.log('init--------ext');
        return true;
      },
      bind_actions: function(){
        console.log('bind_actions--------ext');
        return true;
      },
      settings: function(){
        return true;
      },
      onSave: function(){
        alert('click');
        return true;
      },
      destroy: function(){

      },
      contacts: {
        //select contacts in list and clicked on widget name
        selected: function(){
          console.log('contacts');
        }
      },
      leads: {
        //select leads in list and clicked on widget name
        selected: function(){
          console.log('leads');
        }
      },
      tasks: {
        //select taks in list and clicked on widget name
        selected: function(){
          console.log('tasks');
        }
      }
    };
    return this;
  };



  const module = {
    widget: CustomWidget
  }

  return module
});
