var td = document.querySelectorAll("table td");
var picked = {waitingForEnd: false, gotLoopEnd: false};
for (var x = 0 ; x < td.length; x++) {
  var row = Math.floor(x / 10);
  var column = x % 10;
  $(td[x]).html(x);
  $(td[x]).data("row", row);
  $(td[x]).data("column", column);
}
$("table td").on("mouseover", function (event) {
  $(event.target).toggleClass("selected active");
});
$("table td").on("mouseout", function (event) {
  $(event.target).toggleClass("selected active");
});

$("table td").on("click", function (event) {
  if (picked.gotLoopEnd) {
    picked.gotLoopEnd = false;
     picked.tox = $(event.target).data("column");
     picked.toy = $(event.target).data("row");
     $(".program").html($(".program").html() + "<li>" + "loop " + picked.x + "," + picked.y + " to " + picked.tox+ " " + picked.toy + " to " + picked.endx + " " + picked.endy + "</li>");
  } else {
  // has a picked item
    if ($(".picked").html().length > 0) {
      if (picked.waitingForEnd) {
            picked.waitingForEnd = false;
            picked.gotLoopEnd = true;
            picked.endx = $(event.target).data("column");
      picked.endy = $(event.target).data("row");
      } else {
      $(event.target).html($(".picked").html());
      $(".picked").html("");
      $(".program").html($(".program").html() + "<li>" + "move " + picked.x + "," + picked.y + " to " + $(event.target).data("column") + " " + $(event.target).data("row") + "</li>");
        }
    } else {
      picked.x = $(event.target).data("column");
      picked.y = $(event.target).data("row");
    $(".picked").html($(event.target).html());
    }
  }
});

$("#loop").on("click", function () {
  picked.waitingForEnd = true;
  
});