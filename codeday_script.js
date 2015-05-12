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
    $(".ln").click(function(){add("L");});
    
    $(".x-var").click(function(){add("x");});

    $(".l-paren").click(function(){openParen();});
    $(".r-paren").click(function(){closeParen();});

    $(".submit").click(function(){submit();});
    $(".deriv").click(function(){submitDeriv();});

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
                submit();
                clear();
                break;
            case 61:
                submit();
                break;
            case 68:
            case 100:
                submitDeriv();
                break;
            case 88:
            case 120:
                add("x");
                break;
            case 115:
                add("sin");
                break;
            case 83:
                add("arcsin");
                break;
            case 99:
                add("cos");
                break;
            case 67:
                add("arccos");
                break;
            case 116:
                add("tan");
                break;
            case 84:
                add("arctan");
                break;
            case 82:
                clear();
                break;
        }
    });

    scroll();
});

function submitDeriv(){
    noise();
    var query = calcDeriv(calcTree($(".current").text())).replace(/c/g, "arcC").replace(/s/g, "arcS").replace(/t/g, "arcT").replace(/S/g, "sin").replace(/C/g, "cos").replace(/T/g, "tan").replace(/L/g, "ln").replace(/r/g, "root");
    $(".output").append("<div class=\"question\">d/dx(" + $(".current").text() +
            ")</div><div class=\"answer\">" + query + "</div>");
    scroll();
}

function submit(){
    noise();
    var query = calcEquation(calcTree($(".current").text()), true);
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

function getPrecedence(oper){
    if(oper == "Error")
        return "Error";
    if(oper == '+')
        return 1;
    if(oper == '*' || oper == '/')
        return 2;
    return 3;
}

function getAssoc(oper){
    if(oper == "Error")
        return "Error";
    if(oper == '^')
        return "right";
    return "left";
}

function TreeNode(self){
    this.self = self;
    this.node1 = null;
    this.node2 = null;
    this.containsX = function(){
        if(this.self == "x")
            return true;
        if(this.node1 != null && this.node1.containsX())
            return true;
        if(this.node2 != null && this.node2.containsX())
            return true;
        return false;
    }
    /*this.getIndex = function(level, node){
        return node+(1<<level)-1;
    }
    this.nodes = new Array();
    this.setNode = function(value, level, node){
        this.nodes[this.getIndex(level, node)] = value;
    }
    this.getNode = function(level, node){
        return this.Nodes[this.getIndex(level, node)];
    }*/
}

/*function Stack(){
    this.items = new Array();
    this.push = function(item){
        this.items[this.items.length] = item;
    }
    this.pop = function(){
        if(this.items.length == 0){
            alert("Error!");
            return "Error";
        }
        var item = this.items[this.items.length - 1];
        this.items[this.items.length - 1];
        return item;
    }
    this.get = function(){
        return this.items[this.items.length - 1];
    }
}*/

function calcString(tree){
    if(tree.node2 == null){
        if(tree.node1 == null)
            return tree.self;
        else
            return tree.self + "(" + calcString(tree.node1) + ")";
    }
    else{
        return "(" + calcString(tree.node1) + tree.self + calcString(tree.node2) + ")";
    }
}

function calcDeriv(tree){
    if(tree.containsX()){
        var oneX = tree.node1 != null && tree.node1.containsX();
        var twoX = tree.node2 != null && tree.node2.containsX();
        switch(tree.self){
            case "x":
                return 1;
            case "+":
                if(oneX && !twoX)
                    return "(" + calcDeriv(tree.node1) + "+" + calcEquation(tree.node2) + ")";
                else if(twoX && !oneX)
                    return "(" + calcEquation(tree.node1) + "+" + calcDeriv(tree.node2) + ")";
                else
                    return "(" + calcDeriv(tree.node1) + "+" + calcDeriv(tree.node2) + ")";
            case "*":
                if(oneX && !twoX)
                    return "(" + calcDeriv(tree.node1) + "*" + calcEquation(tree.node2) + ")";
                else if(twoX && !oneX)
                    return "(" + calcEquation(tree.node1) + "*" + calcDeriv(tree.node2) + ")";
                else
                    return "(" + calcDeriv(tree.node1) + "*" + calcString(tree.node2) +
                        "+" + calcString(tree.node1) + "*" + calcDeriv(tree.node2) + ")";
            case "/":
                if(oneX && !twoX)
                    return "(" + calcDeriv(tree.node1) + "/" + calcEquation(tree.node2) + ")";
                else if(twoX && !oneX){
                    return "(-" + calcEquation(tree.node1) + "*" + calcDeriv(tree.node2) + "/" +
                        calcString(tree.node2) + "^2)";
                }
                else{
                    var two = calcString(tree.node2);
                    return "((" + calcDeriv(tree.node1) + "*" + two +
                        "+" + calcString(tree.node1) + "*" + calcDeriv(tree.node2) + ")/" +
                        two + "^2)";
                }
            case "^":
                if(oneX && !twoX){
                    var num = calcEquation(tree.node2);
                    return "(" + num + "*" + calcDeriv(tree.node1) + "*" + calcString(tree.node1) +
                        "^" + (num - 1) + ")";
                }
                else if(twoX && !oneX){
                    var num = calcEquation(tree.node1);
                    return "(" + Math.log(num) / Math.log(Math.E) + "*" + calcDeriv(tree.node2) + "*" + num + "^" + calcString(tree.node1) + ")";
                }
                else{//TODO not done yet TODO TODO TODO
                    var one = calcString(tree.node1);
                    var two = calcString(tree.node2);
                    return "(" + one + "^(" + two + "-1)*(" +  one + "*ln" + one + "*" +
                        calcDeriv(tree.node2) + "+" + two + "*" + calcDeriv(tree.node1) + "))";
                }
            case "-":
                return "(-" + calcDeriv(tree.node1) +")";
            case "L":
                return "(" + calcDeriv(tree.node1) + "/" + calcString(tree.node1) + ")";
            case "r":
                return "(" + calcDeriv(tree.node1) + "/r" + calcString(tree.node1) + "/2)";
            case "S":
                return "(" + calcDeriv(tree.node1) + "*C" + calcString(tree.node1) + ")";
            case "C":
                return "(-" + calcDeriv(tree.node1) + "*S" + calcString(tree.node1) + ")";
            case "T":
                return "(" + calcDeriv(tree.node1) + "/(C" + calcString(tree.node1) + ")^2)";
            case "s":
                return "(" + calcDeriv(tree.node1) + "/r(1-" + calcString(tree.node1) + "^2))";
            case "c":
                return "(-" + calcDeriv(tree.node1) + "/r(1-" + calcString(tree.node1) + "^2))";
            case "t":
                return "(" + calcDeriv(tree.node1) + "/(1+" + calcString(tree.node1) + "^2))";
            default:
                return "Error";
        }
    }
    else return "0";
}

function calcTree(equation){
    
    if(equation == "")
        return new TreeNode(0);
    if(equation == "9+10")
        return new TreeNode(21);
	equation = equation.replace(/-/g, "+-").replace(/\*\+-/g, "*-").replace(/\/\+-/g, "/-").replace(/\^\+-/g, "^-").replace(/sin\+-/g, "sin-").replace(/cos\+-/g, "cos-").replace(/tan\+-/g, "tan-").replace(/ln\+-/g, "ln-").replace(/root\+-/g, "root-").replace(/\+-\+-/g, "+").replace(/-\+-/g, "").replace(/\+\+/g, "+").replace(/arcsin/g, "s").replace(/arccos/g, "c").replace(/arctan/g, "t").replace(/sin/g, "S").replace(/cos/g, "C").replace(/tan/g, "T").replace(/ln/g, "L").replace(/root/g, "r");
    
    console.log(equation);
    var ops = "*/+^-rLsScCtT)";
    var ops1 = "*/+^";
    var ops2 = "-rLsScCtT";
    
    var output = new Array();
    var stack = new Array();
    
    var i = 0;
    
    while(i < equation.length){
        var c = equation.charAt(i);
        if(c == '('){
            //console.log(c);
            stack.push(c);
            i++;
        }
        else if(c == ')'){
            while(stack[stack.length - 1] != "("){
                output.push(stack.pop());
                if(stack.length == 0)
                    return "Error";
            }
            stack.pop();
            i++;
        }
        else if(ops1.indexOf(c) > -1){
            while(stack.length > 0 && stack[stack.length - 1] != "(" &&
                  ((getAssoc(stack[stack.length - 1]) == "left" && getPrecedence(stack[stack.length - 1]) > getPrecedence(c)) ||
                  (getAssoc(stack[stack.length - 1]) == "right" && getPrecedence(stack[stack.length - 1]) >= getPrecedence(c)))){
                output.push(stack.pop());
            }
            stack.push(c);
            i++;
        }
        else if(ops2.indexOf(c) > -1){
            stack.push(c);
            i++;
        }
        else{
            var number = "" + c;
            while(ops.indexOf(equation.charAt(++i)) == -1)
                number += equation.charAt(i);
            //console.log(number);
            output.push(number);
        }
    }
    while(stack.length > 0){
        if(stack[stack.length - 1] == '('){
            return "Error";
        }
        output.push(stack.pop());
    }
    
    //console.log(output);
    var tree = parseTree(output, new TreeNode(output.pop()));
    console.log(tree);
    return tree;
}

function parseTree(stack, tree){
    
    //var ops = "*/-+^-rLsScCtT(";
    var ops1 = "*/+^(";
    var ops2 = "-rLsScCtT";
    
    if(ops1.indexOf(tree.self) > -1) {
        tree.node2 = parseTree(stack, new TreeNode(stack.pop()));
        tree.node1 = parseTree(stack, new TreeNode(stack.pop()));
        return tree;
    }
    else if(ops2.indexOf(tree.self) > -1) {
        tree.node1 = parseTree(stack, new TreeNode(stack.pop()));
    }
    return tree;
    
}

function calcEquation(tree, topLevel){
    
    if(tree.node2 == null){
        if(tree.node1 == null){
            return parseFloat(tree.self);
        }
        else{
            switch(tree.self){
                case "-":
                    return -calcEquation(tree.node1);
                case "S":
                    return Math.sin(calcEquation(tree.node1));
                case "s":
                    return Math.asin(calcEquation(tree.node1));
                case "C":
                    return Math.cos(calcEquation(tree.node1));
                case "c":
                    return Math.acos(calcEquation(tree.node1));
                case "T":
                    return Math.tan(calcEquation(tree.node1));
                case "t":
                    return Math.atan(calcEquation(tree.node1));
                case "L":
                    return Math.log(calcEquation(tree.node1)) / Math.log(Math.E);
                case "r":
                    return Math.pow(calcEquation(tree.node1), 0.5);
                default:
                    return 0;
            }
        }
    }
    else{
        switch(tree.self){
            case "+":
                return calcEquation(tree.node1) + calcEquation(tree.node2);
            case "*":
                return calcEquation(tree.node1) * calcEquation(tree.node2);
            case "/":
                return calcEquation(tree.node1) / calcEquation(tree.node2);
            case "^":
                return Math.pow(calcEquation(tree.node1), calcEquation(tree.node2));
                //TODO make sure we're done
            default:
                return 0;
        }
    }
    
    /*if(equation == "")
        return 0;
    if(topLevel && equation == "9+10")
        return 21;
	if(topLevel){
		equation = equation.replace("-", "+-").replace("*+-", "*-").replace("/+-", "/-").replace("L+-", "L-").replace("r+-", "r-").replace("^+-", "^-").replace("++", "+");
    }
    while(equation.indexOf("(") >= 0){
        var parens = 0;
        var toParse = "";
        var parsing = false;
        var done = false;
        var i;
        var indexOfParen = 0;
        for(i = 0; !done; i++){
            if(equation.charAt(i) == '('){
                if(!parsing){
                    indexOfParen = i;
                }
                parens++;
                parsing = true;
            }
            else if(equation.charAt(i) == ')' && --parens <= 0)
                done = true;
            else if(parsing)
                toParse += equation.charAt(i);
        }
        equation = equation.substring(0, indexOfParen) + calcEquation(toParse, false) + equation.substring(i);
        
        //equation = equation.replace(toParse, "" + calcEquation(toParse.substring(1, toParse.length - 1), false));
    }
    var firstIndex = equation.lastIndexOf('+');
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
    else{
//        if(equation.charAt(firstIndex) == '-' && firstIndex > 0 && ['*', '/', '+', '-', 'L', 'r', '^'].indexOf(equation.charAt(firstIndex - 1)) == -1)
//            v = calcEquation(equation.substring(0, firstIndex), false) -
//            calcEquation(equation.substring(firstIndex + 1), false);
//        else
        v = calcEquation(equation.substring(0, firstIndex), false) +
        calcEquation(equation.substring(firstIndex + 1), false);
    }
    return v;*/
}

/*function doParse(query){
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
}*/

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