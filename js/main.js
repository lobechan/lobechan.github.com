// 存储公式
var ArrayF = new Array();

// 存储扑克图片地址
var puke = [{"src":"img/puke/htA.jpg"},

			{"src":"img/puke/ht2.jpg"},

			{"src":"img/puke/ht3.jpg"},

			{"src":"img/puke/ht4.jpg"},

			{"src":"img/puke/ht5.jpg"},

			{"src":"img/puke/ht6.jpg"},

			{"src":"img/puke/ht7.jpg"},

			{"src":"img/puke/ht8.jpg"},

			{"src":"img/puke/ht9.jpg"},

			{"src":"img/puke/ht10.jpg"},

			{"src":"img/puke/htJ.jpg"},

			{"src":"img/puke/htQ.jpg"},

			{"src":"img/puke/htK.jpg"},];

function getCookie(c_name){
	if (document.cookie.length>0){ 
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1){ 
			c_start=c_start + c_name.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	return ""
}

function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie = c_name+ "=" + escape(value)+
	((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
}

// 消息提示
function warn(msg,opt,left,top){
	if(opt){
	var obj = $("#"+opt);
	}
	new Toast({context:$('body'),message:msg},obj,left,top).show();
	
	}
var Toast = function(config,obj,left,top){
	this.context = config.context==null?$('body'):config.context;//上下文
	this.message = config.message;//显示内容
	this.time = config.time==null?3000:config.time;//持续时间
	this.left = config.left;//距容器左边的距离
	this.top = (screen.availHeight/4)*3;//距容器上方的距离
	if(obj){
	// this.left = obj.offset().left + left; // 居中
	this.top = obj.offset().top + top;
	}
	this.init();
}
var msgEntity;
Toast.prototype = {
	//初始化显示的位置内容等
	init : function(){
		$("#toastMessage").remove();
		//设置消息体
		var msgDIV = new Array();
		msgDIV.push('<div id="toastMessage">');
		msgDIV.push('<span>'+this.message+'</span>');
		msgDIV.push('</div>');
		msgEntity = $(msgDIV.join('')).appendTo(this.context);
		//设置消息样式
		var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;
		var top = this.top == null ? '20px' : this.top;
		msgEntity.css({position:'absolute',top:top,'z-index':'99',left:left,'background-color':'black',color:'white','font-size':'12px',padding:'5px',margin:'5px','border-radius':'4px','-moz-border-radius':'4px','-webkit-border-radius':'4px',opacity:'0.5','font-family':'微软雅黑'});
		//msgEntity.addClass(".toast");
		msgEntity.hide();
	},
	//显示动画
	show :function(){
		msgEntity.fadeIn(this.time/2);
		msgEntity.fadeOut(this.time/2);
	}
		
}

//检测公式左右括号对应情况
function checkParentheses(e){
	var num_left = 1,//多一个右括号
	num_right = 0;
	for(var n=0;n<e.length;n++){
		if(e.charAt(n)=='('){
			num_left++;
		}else if(e.charAt(n)==')'){
			num_right++;
		}
	}
	return num_right==num_left;
}

//判断是否四张牌都选择了
function checkAll(){
	var flag = true;
	$(".numbtn").each(function(){
      	if(!$(this).hasClass('active')){
			flag = false;
		}
    });
	return flag;
}

//计算公式方法
i=0;//运算串索引
function func(txt)
{
	var res=0;//结果
	var arr=new Array();//运算数组
	var oper=new Array();//运算符数组
	var x=0;//索引
	var PRI=false;//主要判断乘法和除法的
	if(txt=="")
	{
		return;
	}
	if(!checkParentheses(txt)){
		return "非法表达式";
	}
	var number="";	//记录上一个字符	
	while(i<txt.length)
	{
		if(txt[i]=="=")
		{
			// alert("后面有等于号,不用写了");
			return "后面有等于号,不用写了";
		}
		//var temp=parseInt(txt[i]);
		if(isNaN(txt[i]))
		{
			if(txt[i]=="(")
			{
				i++;
				number=func(txt);
			}
			if(txt[i]==".")
			{
				number+=txt[i];
				i++;
				continue;
			}
			//检查上一个字符是不是运算符; 像 ++ -- 之类的运算符就不考虑了
			if(isNaN(number))
			{
				// alert("非法表达式");
				return "非法表达式";
			}
			if(number=="")
			{
				// alert("非法表达式");
				return "非法表达式";
			}
			if(PRI)
			{
				if(oper[x-1]=="*")
				{
					number=parseFloat(number)*parseFloat(arr[x-1]);
				}
				if(oper[x-1]=="/")
				{
					if(number=="0")
					{
						// alert("除数不能为0");
						return "除数不能为0";
					}
					number=parseFloat(arr[x-1])/parseFloat(number);
				}
				x--;
			}
			switch(txt[i])
			{
				case "+" : 
				case "-" : oper[x]=txt[i];
							arr[x]=number;
							number="";
							PRI=false;
							x++;
							break;
				case "*" : 
				case "/" : oper[x]=txt[i];
							arr[x]=number;
							number="";
							PRI=true;
							x++;
							break;
			}
			if(txt[i]==")")
			{
				arr[x]=number;
				number="";
				res=parseFloat(arr[0]);
				for(var j=1;j<arr.length;j++)
				{
					switch(oper[j-1])
					{
						case "+" :res+=parseFloat(arr[j]);break;
						case "-" :res-=parseFloat(arr[j]);break;
					}
				}
				i++;
				return res;
			}
		}
		else
		{
			number+=txt[i];
		}
		i++;
	}
	if(txt[i]!=")")
	{
		// alert("括号不匹配");
		// i=0;
		return "括号不匹配";
	}
}

// 存储Cookie并显示到show
function setCookieAndShow(a,c){
	a.push(c);
    setCookie('ArrayF',a);
    $('#show').html(a.join(''));
}

// 随机产生四个数字并为图片替换相应数字的图片
function beginGame(e){
	e = (e==12)?12:9;
	var i1 = Math.ceil(Math.random()*(0-12)+12),//Math.random()*(n-m)+m  m-n之间
	i2 = Math.ceil(Math.random()*(0-12)+12),
	i3 = Math.ceil(Math.random()*(0-12)+12),
	i4 = Math.ceil(Math.random()*(0-12)+12);
	$('.img1').attr("src",puke[i1].src);
	$('.img1').attr("value",(((i1+1)>10) && e==9)?10:i1+1);
	$('.img2').attr("src",puke[i2].src);
	$('.img2').attr("value",(((i2+1)>10) && e==9)?10:i2+1);
	$('.img3').attr("src",puke[i3].src);
	$('.img3').attr("value",(((i3+1)>10) && e==9)?10:i3+1);
	$('.img4').attr("src",puke[i4].src);
	$('.img4').attr("value",(((i4+1)>10) && e==9)?10:i4+1);
}

//清空
function clr(){
    $('#show').empty();
    ArrayF.splice(0,ArrayF.length);
    setCookie('ArrayF',ArrayF);
    $('.numbtn').removeClass('active');
}

//删除
function del(){
	//如果是数字将卡牌移除avtive
	var last = ArrayF.length-1;
	$('.numbtn').each(function(){
		if($(this).find('img').attr('value')==ArrayF[last] && $(this).hasClass('active')){
			var thisname = '[name='+$(this).attr('name')+']';
            $(thisname).removeClass('active');
			return false;
		}
	});
	//删除
	ArrayF.pop();
	setCookie('ArrayF',ArrayF);
	$('#show').html(ArrayF.join(''));
}

//点击操作符
function opt(o){
    switch(o)
    {
    case '+':
        setCookieAndShow(ArrayF,'+');
        break;
    case '-':
        setCookieAndShow(ArrayF,'-');
        break;
    case '*':
        setCookieAndShow(ArrayF,'*');
        break;
    case '/':
        setCookieAndShow(ArrayF,'/');
        break;
    case '(':
        setCookieAndShow(ArrayF,'(');
        break;
    case ')':
        setCookieAndShow(ArrayF,')');
        break;
    default:
        warn('对不起，发生错误，请刷新重来','info');
    }
}

//计算结果并提示
function calculate(){
	//判断四张牌是否都选择
	if(checkAll()){
	    var formula = $('#show').text()+')';
	    var result=func(formula);//调用方法
	    i=0;
	    if(result==24){
	        clr();
	        beginGame(getCookie('gameMode'));
	        warn('恭喜你，已进入下一题','info');
	    }else{
	        warn(result,'info');
	        warn('再试试哦','info');
	    }
	}else{
		warn('少选扑克牌了哦','info');
	}
}

// 监听键盘事件
function enterKey(event){
	switch(event.keyCode) {
		case 8:
			// backspace
			del();
			break;
		case 27:
			// Esc
			clr();
			break;
	  	case 13:
	  		// Enter
		  	calculate();
		  	break;
	  	case event.shiftKey && 57:
	  		// alert('(');
  			opt('(');
  			break;
  		case event.shiftKey && 48:
	  		// alert(')');
			opt(')');
  			break;
  		case !event.shiftKey && 189:
	  		// alert('-');
	  		opt('-');
  			break;
  		case 109:
  			// alert('-');
  			opt('-');
  			break;
  		case event.shiftKey && 187:
	  		// alert('+');
	  		opt('+');
  			break;
  		case 107:
	  		// alert('+');
	  		opt('+');
  			break;
  		case event.shiftKey && 56:
	  		// alert('*');
	  		opt('*');
  			break;
  		case 106:
	  		// alert('*');
	  		opt('*');
  			break;
  		case 191:
	  		// alert('/');
	  		opt('/');
  			break;
  		case 111:
	  		// alert('/');
	  		opt('/');
  			break;
  		// 48-57:0-9
  		// 65-68:abcd
  		case 65:
  			if(!$('[name=numbtn1]').hasClass('active')){
                setCookieAndShow(ArrayF,$('[name=numbtn1]').find('img').attr('value'));
                $('[name=numbtn1]').addClass('active');
            }
            break;
        case 66:
        	if(!$('[name=numbtn2]').hasClass('active')){
                setCookieAndShow(ArrayF,$('[name=numbtn2]').find('img').attr('value'));
                $('[name=numbtn2]').addClass('active');
            }
            break;
        case 67:
        	if(!$('[name=numbtn3]').hasClass('active')){
                setCookieAndShow(ArrayF,$('[name=numbtn3]').find('img').attr('value'));
                $('[name=numbtn3]').addClass('active');
            }
            break;
        case 68:
        	if(!$('[name=numbtn4]').hasClass('active')){
                setCookieAndShow(ArrayF,$('[name=numbtn4]').find('img').attr('value'));
                $('[name=numbtn4]').addClass('active');
            }
            break;
	}
}

//切换游戏模式
function changeMode(){
	(getCookie('gameMode')==9)?setCookie('gameMode',12):setCookie('gameMode',9);
}