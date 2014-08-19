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


// 随机产生四个数字并为图片替换相应数字的图片
function beginGame(){
	var i1 = Math.ceil(Math.random()*(0-12)+12),//Math.random()*(n-m)+m  m-n之间
	i2 = Math.ceil(Math.random()*(0-12)+12),
	i3 = Math.ceil(Math.random()*(0-12)+12),
	i4 = Math.ceil(Math.random()*(0-12)+12);
	$('.img1').attr("src",puke[i1].src);
	$('.img1').attr("value",i1+1);
	$('.img2').attr("src",puke[i2].src);
	$('.img2').attr("value",i2+1);
	$('.img3').attr("src",puke[i3].src);
	$('.img3').attr("value",i3+1);
	$('.img4').attr("src",puke[i4].src);
	$('.img4').attr("value",i4+1);
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


//清空
function clr(){
    $('#show').empty();
    $('.numbtn').removeClass('active');
}

//点击操作符
function opt(o){
    switch(o)
    {
    case '+':
        $('#show').append('+');
        break;
    case '-':
        $('#show').append('-');
        break;
    case '*':
        $('#show').append('*');
        break;
    case '/':
        $('#show').append('/');
        break;
    case '(':
        $('#show').append('(');
        break;
    case ')':
        $('#show').append(')');
        break;
    default:
        warn('对不起，发生错误，请刷新重来','info');
    }
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

//计算结果并提示
function calculate(){
	if(checkAll()){
	    var formula = $('#show').text()+')';
	    var result=func(formula);//调用方法
	    i=0;
	    if(result==24){
	        clr();
	        beginGame();
	        warn('恭喜你，已进入下一题','info');
	    }else{
	        warn(result,'info');
	    }
	}else{
		warn('少选扑克牌了哦','info');
	}
}