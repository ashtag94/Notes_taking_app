$(document).ready(function(){

    $('form').on('submit', function(){
  
        var item = $('form input');
        var todo = {item: item.val()};
  
        $.ajax({
          type: 'POST',
          url: '/dashboard',
          data: todo,
          success: function(data){
            //do something with the data via front-end framework
            location.reload();
          }
        });
  
        return false;
  
    });
  
    $('li').on('click', function(){
        var item = $(this).text().replace(/ /g, "-");
        // var item = $(this).text();
        // var todo = {item: $(this).text()};
        $.ajax({
          type: 'DELETE',
          url: '/dashboard/' + item,
          // data: todo,
          success: function(data){
            //do something with the data via front-end framework
            location.reload();
          }
        });
    });
  
  });
  