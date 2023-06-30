var rows = 15;
var size = 100;
for (var x = 0 ; x < rows ; x++) {
  $("#one tbody").append("<tr></tr>");
  var row = $("#one tbody tr")[x];
  for (var y = 0 ; y < size; y++) {
    $(row).append("<td></td>");
  }
}

var td = document.querySelectorAll("#one table td");
var two = document.querySelectorAll("#two table td");
var doc = JSON.stringify({
  "children": [
    {"name": "bob", "age": 26},
    {"name": "sam", "age": 33}
  ]
});
console.log(doc);
var pos = -1;
var x = 0;
var y = 0;
var counter1 = 1000;
var counter2 = 1000;
var waitingForIdentifier = false;
var type;
var symbol = " ";
var end = false;
var last_char = " ";
function getChar() {
  console.log("pos", pos);
  if (pos + 1 >= doc.length) {
    end = true;
    return doc[pos];
  } else {
    pos = pos + 1;
    
    return doc[pos];
  }
  
}
function getToken() {
  type = "token";
  symbol = last_char;
  while (last_char == " ") {
    last_char = getChar();
  }
  if (last_char == ":") {
    last_char = getChar();
    return "colon";
  }
  if (last_char == ",") {
    last_char = getChar();
    return "comma";
  }
  if (last_char == "\"") {
    last_char = getChar();
    return "quote";
  }
  if (last_char == "[") {
    symbol = last_char
    last_char = getChar();
    return "opensquare";
  }
  if (last_char == "]") {
    symbol = last_char;
    last_char = getChar();
    return "closesquare";
  }
  if (last_char == "{") {
    symbol = last_char;
    last_char = getChar();
    
    return "opencurly";
  }
  if (last_char == "}") {
    symbol = last_char;
    last_char = getChar();
  
    return "closecurly";
  }
  
  const regex = /[A-Za-z0-9_]/g;
  console.log(pos);

  var found = last_char.match(regex);
  var identifier = last_char;
  if (found) {
    
    while (found && !end && counter2 > 0) {
      last_char = getChar();
      found = last_char.match(regex);
      
      console.log(last_char);
      if (found) {
        identifier += last_char; 
      }
      counter2--;
    }
    type = "identifier";
    return identifier;
  }
}
var stack = [];
while (end == false && counter1 > 0) {
  counter1--;
  var token = getToken();
  var output = token;
  console.log(token);
  if (token == "quote") {
    continue;
  }

   if (token == "closecurly" || token == "closesquare" || token == "closecurly" || token == "opencurly" || token == "opensquare" ) {
    output = symbol;
   }
  if (token == "closecurly" || token == "closesquare") {
    output = symbol;
    // y++;
     // x -= 1;
  }
    if (token == "opencurly" || token == "opensquare") {
      console.log("appending x", x)
    stack.push(x);
  }
    if (token == "closecurly" || token == "closesquare") {
    x = stack.pop();
    y++;
  }

  if (token != "quote" && token != "colon" && token != "comma") {
    $(two[(y * 10) + x]).html(output);
  }
  
  
   
  if (token == "colon") {
    waitingForIdentifier = true;

  } 

  if (waitingForIdentifier && type == "identifier") {
    // y++;
    // x -= 1;
    waitingForIdentifier = false;
  }
  if (!waitingForIdentifier && type == "identifier") {
    x += 1;
  }

  if (token == "opencurly" || token == "opensquare") {
    y += 1;
    x++;
  }

  if (token == "comma") {
    y += 1;
    x = stack[stack.length - 1] + 1;
    // x -= 2;

    
  }
  



}
console.log("opened");

var picked = {waitingForEnd: false, gotLoopEnd: false};
for (var x = 0 ; x < td.length; x++) {
  var row = Math.floor(x / 10);
  var column = x % 10;
  $(td[x]).html("&nbsp");
  $(td[x]).data("row", row);
  $(td[x]).data("column", column);
}

$(td[15]).html("1");


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