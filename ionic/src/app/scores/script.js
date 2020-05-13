document.addEventListener('DOMContentLoaded', (event) => {
    console.log('js');
  })

$(document).ready(function(){
  var countS = 25;
  $("#session").html(countS);
  var countB = 5;
  $("#break").html(countB);
  var pos = "pomodoro";
  var countLama;
  var posLama;
  var count;
  $("#stats").html(pos);
  var clock = $(".timer").FlipClock(0, {
    countdown: true,
    clockFace: 'MinuteCounter',
    autoStart: false,
    callbacks: {
      interval: function(){
        if (clock.getTime() == 0){
          if (pos == "session"){
            clock.setTime(countB*60);
            clock.start();
            pos = "break";
            $("#stats").html(pos);
          } else if (pos == "break"){
            clock.setTime(countS*60);
            clock.start();
            pos = "session";
            $("#stats").html(pos);
          }
        }        
      }
    }
  })  

  
  
  $("#start").on("click", function(){
    if (count != countS || clock.getTime()==0){
      clock.setTime(5*60);
      pos="session";
      $("#stats").html(pos);
    } else {
      pos = posLama;
      $("#stats").html(pos);
    }
    count = countS;    
    clock.start();    
  });
  /*
  $("#stop").on("click", function(){
    clock.stop();
    countLama = clock.getTime();
    posLama = $("#stats").html();
  });*/
  $("#clear").on("click", function(){
    clock.stop();
    pos = "pomodoro";
    $("#stats").html(pos);
    clock.setTime(0);
  });
});