var meow;
$(document).ready(function(){
	$.get("counter.php").done(function(data){
		$(".hits").text(data);
	});
	$(".clear").click(function(){
		clear();
	});
	var doodly = $(".doodly");
	doodly.prop("loop", true);
	doodly.trigger("play");
	meow = $(".meow");
	
	$(".switch").click(function(){
		noise();
		if(doodly.prop("paused")){
			doodly.trigger("play");
		}
		else{
			doodly.trigger("pause");
		}
	});
	
	$(".zero").click(function(){add("0");});
	$(".one").click(function(){add("1");});
	$(".two").click(function(){add("2");});
	$(".three").click(function(){add("3");});
	$(".four").click(function(){add("4");;});
	$(".five").click(function(){add("5");});
	$(".six").click(function(){add("6");});
	$(".seven").click(function(){add("7");});
	$(".eight").click(function(){add("8");});
	$(".nine").click(function(){add("9");});
	$(".multiply").click(function(){add("*");});
	$(".divide").click(function(){add("/");});
	$(".add").click(function(){add("+");});
	$(".subtract").click(function(){add("-");});
	$(".point").click(function(){add(".");});
	$(".pi-num").click(function(){add("3.14159");});
	$(".e-num").click(function(){add("2.71828");});
	$(".exponential").click(function(){add("^");});
	$(".nth-root").click(function(){add("r");});
	$(".log").click(function(){add("L");});
	
	$(".l-paren").click(function(){openParen();});
	$(".r-paren").click(function(){closeParen();});
	
	$(".submit").click(function(){submit();});
	
	$("body").keypress(function(key){
		if(key.charCode >= 48 && key.charCode < 58)
			add(String.fromCharCode(key.charCode));
		switch(key.charCode){
		case 69:
		case 101:
			add("2.71828");
			break;
		case 80:
		case 112:
			add("3.14159");
			break;
		case 76:
		case 108:
			add("L");
			break;
		case 82:
		case 114:
			add("r");
			break;
		case 42:
			add("*");
			break;
		case 47:
			add("/");
			break;
		case 43:
			add("+");
			break;
		case 45:
			add("-");
			break;
		case 94:
			add("^");
			break;
		case 40:
			openParen();
			break;
		case 41:
			closeParen();
			break;
		case 46:
			add(".");
			break;
		case 13:
		case 61:
			submit();
			break;
		case 67:
		case 99:
			clear();
			break;
		}
	});
	
	scroll();
});

function submit(){
	noise();
	var query = calcEquation($(".current").text(), true);
	$(".output").append("<div class=\"question\">" + $(".current").text() +
			"</div><div class=\"answer\">" + query + "</div>");
	scroll();
}

function clear(){
	noise();
	$(".old").remove();
	$(".current").text("");
	scroll();
}

function add(str){
	noise();
	$(".current").append(str);
	scroll();
}

function calcEquation(equation, topLevel){
	if(topLevel && equation == "9+10")
		return 21;
	if(topLevel)
		equation = equation.replace("-", "+-");
	while(equation.indexOf("(") > 0){
		var parens = 0;
		var toParse = "";
		var parsing = false;
		var done = false;
		var i;
		var indexOfParen;
		for(i = 0; !done; i++){
			if(equation.charAt(i) == '('){
				if(!parsing){
					indexOfParen = i;
				}
				parens++;
				parsing = true;
			}
			if(parsing)
				toParse += equation.charAt(i);
			if(equation.charAt(i) == ')' && --parens < 0)
				done = true;
		}
		console.log(equation);
		if(parsing){
			equation = equation.substring(0, indexOfParen - 1) + calcEquation(toParse.substring(1, toParse.length - 1), false) + equation.substring(i + 1);
		}
		//equation = equation.replace(toParse, "" + calcEquation(toParse.substring(1, toParse.length - 1), false));
	}
	var firstIndex = firstIndex = equation.lastIndexOf('+');
	var secondIndex = -1;
	var thirdIndex = -1;
	var v = 0.0;
	if(firstIndex == -1){
		secondIndex = Math.max(equation.lastIndexOf('*'), equation.lastIndexOf('/'));
		if(secondIndex == -1){
			thirdIndex = Math.max(equation.lastIndexOf('L'), Math.max(equation.lastIndexOf('r'), equation.lastIndexOf('^')));
			if(thirdIndex == -1)
				v = parseFloat(equation);
			else{
				switch(equation.charAt(thirdIndex)){
				case 'L':
					v = Math.log(calcEquation(equation.substring(thirdIndex + 1), false)) /
						Math.log(calcEquation(equation.substring(0, thirdIndex), false));
					break;
				case 'r':
					v = Math.pow(calcEquation(equation.substring(thirdIndex + 1), false),
						1 / calcEquation(equation.substring(0, thirdIndex), false));
					break;
				case '^':
					v = Math.pow(calcEquation(equation.substring(0, thirdIndex), false),
						calcEquation(equation.substring(thirdIndex + 1), false));
					break;
				}
			}
		}
		else{
			switch(equation.charAt(secondIndex)){
			case '*':
				v = calcEquation(equation.substring(0, secondIndex), false) *
					calcEquation(equation.substring(secondIndex + 1), false);
			break;
			case '/':
				v = calcEquation(equation.substring(0, secondIndex), false) /
					calcEquation(equation.substring(secondIndex + 1), false);
			break;
			}
		}
	}
	else
		v = calcEquation(equation.substring(0, firstIndex), false) +
		calcEquation(equation.substring(firstIndex + 1), false);
	return v;
}

function doParse(query){
	if(query.replace(/[0-9]+\.[0-9]+|[0-9]+|\.[0-9]+/, "").length == 0){
		return parseFloat(query);
	}
	else{
		var end = "";
		var spot = query.length - 1;
		var hadParentheses = false;
		var done = false;
		var count = 0;
		while(!done){
			if(query.charAt(spot) == ')'){
				hadParentheses = true;
				count++;
			}
			else if(query.charAt(spot) == '(')
				count--;
			if(count == 0){
				if(hadParentheses){
					done = true;
					spot--;
				}
				else
					if(spot == 0 || ['+', '-', '*', '/', '^', 'r', 'L']
							.indexOf(query.charAt(spot)) >= 0)
						done = true;
			}
			end = query.substring(spot) + end;
			query = query.substring(0, spot);
			spot--;
		}
		var concat = query + end;
		spot += 1;
		var first = concat.substring(0, spot);
		if(first.substring(first.length - 1) == ")")
			first = first.substring(1, first.length - 1);
		var second = concat.substring(spot + 1);
		if(second.substring(second.length - 1) == ")")
			second = second.substring(1, second.length - 1);
		console.log("a " + concat);
		console.log("b " + first);
		console.log("c " + concat.substring(spot, spot + 1));
		console.log("d " + second);
		if(first.length > 0 && second.length > 0){
			switch(concat.substring(spot, spot + 1)){
			case "+":
				return doParse(first) + doParse(second);
				break;
			case "-":
				return doParse(first) - doParse(second);
				break;
			case "*":
				return doParse(first) * doParse(second);
				break;
			case "/":
				return doParse(first) / doParse(second);
				break;
			case "^":
				return Math.pow(doParse(first), doParse(second));
				break;
			case "r":
				return Math.pow(doParse(second), 1 / doParse(first));
				break;
				break;
			case "L":
				return Math.log(doParse(second)) / Math.log(doParse(first));
				break;
			}
		}
		else if(second.length == 0)
			return doParse(first);
		else
			return doParse(second);
	}
}

function openParen(){
	$(".current").append("(");
	$(".current").toggleClass("current old");
	$(".output_wrapper_sub").append("<div class=\"secondary current\"></div>");
	scroll();
}
function closeParen(){
	var end = $(".current");
	var array = $(".old");
	var prev = array.get(array.length - 1);
	if(end.text().length > 0 && array.length > 0){
		$(prev).append(end.text() + ")");
		$(prev).toggleClass("old current");
		$(end).remove();
	}
}
function scroll(){
	$(".output_wrapper").scrollTop($(".output_wrapper_sub").height()+60);
	$(".output").scrollTop($(".answer").length * 30 + $(".question").length * 30 + 60);
}
function noise(){
	meow.prop("currentTime", 0);
	meow.trigger("play");
}