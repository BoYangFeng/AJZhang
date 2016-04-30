var FKeyPad = document.Keypad;
var Accum = 0;
var FlagNewNum = false;
var PendingOp = "";
var targetInput = null;
var s_leghet = 0;
function NumPressed (Num)
{
    if (FlagNewNum) {
        FKeyPad.ReadOut.value  = Num;
        FlagNewNum = false;
    }else{
        if(FKeyPad.ReadOut.value == "0")
            FKeyPad.ReadOut.value = Num;
        else
            FKeyPad.ReadOut.value += Num;
    }
}
function resultShow(obj){
     $("#calc").hide();	
     $("#ReadOut").val($("#ReadOut").val()==""?0:$("#ReadOut").val());
    $(obj).val($("#ReadOut").val());
}
function CalcShow(){
    $("#calc").toggle();	
}
function ClearNum ()
{
    s_leghet = Len(FKeyPad.ReadOut.value);
    if (s_leghet>1) {
        FKeyPad.ReadOut.value = FKeyPad.ReadOut.value.substr(0,s_leghet-1);
    }
}

function Operation (Op)
{
    var Readout = FKeyPad.ReadOut.value;
    if (FlagNewNum && PendingOp != "=");
    else
    {
        FlagNewNum = true;
        if ( '+' == PendingOp )
            //				Accum += parseFloat(Readout);
            Accum = accAdd(Accum,Readout);
        else if ( '-' == PendingOp )
            //				Accum -= parseFloat(Readout);
            Accum = accSub(Accum,Readout);
        else if ( '/' == PendingOp )
            //				Accum /= parseFloat(Readout);
            Accum = accDiv(Accum,Readout);
        else if ( '*' == PendingOp )
            //				Accum *= parseFloat(Readout);
            Accum = accMul(Accum,Readout);
        else
            Accum = parseFloat(Readout);
        FKeyPad.ReadOut.value = Accum;
        PendingOp = Op;
    }
}

function Decimal ()
{
    var curReadOut = FKeyPad.ReadOut.value;
    if (FlagNewNum)
    {
        curReadOut = "0.";
        FlagNewNum = false;
    }else{
        if (curReadOut.indexOf(".") == -1)
            curReadOut += ".";
    }

    FKeyPad.ReadOut.value = curReadOut;
}

function ClearEntry ()
{
    FKeyPad.ReadOut.value = "0";
    FlagNewNum = true;
}

function Clear ()
{
    Accum = 0;
    PendingOp = "";
    ClearEntry();
}

function Neg ()
{
    FKeyPad.ReadOut.value = parseFloat(FKeyPad.ReadOut.value) * -1;
}

function Percent ()
{
    FKeyPad.ReadOut.value = (parseFloat(FKeyPad.ReadOut.value) / 100) * parseFloat(Accum);
}
	

//计算器
function showCalc(target)
{		
    var position,calcObj;
    FKeyPad = document.getElementById('Keypad');
    targetInput = document.getElementById(target);	
    calcObj = document.getElementById('calc');
			
    position = fetchOffset(targetInput);	  	
    calcObj.style.display = 'block';
    calcObj.style.top = position.top+22;
    calcObj.style.left = position.left-40;	    	
    document.getElementById('ReadOut').value = '0';
}
function HideCalc()
{
    document.getElementById('calc').style.display = 'none';
    targetInput.value = document.getElementById('ReadOut').value;
}	
 
//返回值：arg1加上arg2的精确结果
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{
        r1=arg1.toString().split(".")[1].length
        }catch(e){
        r1=0
        }
    try{
        r2=arg2.toString().split(".")[1].length
        }catch(e){
        r2=0
        }
    m=Math.pow(10,Math.max(r1,r2))
    return (arg1*m+arg2*m)/m
}

//返回值：arg1减上arg2的精确结果
function accSub(arg1,arg2){
    return accAdd(arg1,-arg2);
}

//返回值：arg1乘以arg2的精确结果
function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{
        m+=s1.split(".")[1].length
        }catch(e){}
    try{
        m+=s2.split(".")[1].length
        }catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}

//返回值：arg1除以arg2的精确结果
function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{
        t1=arg1.toString().split(".")[1].length
        }catch(e){}
    try{
        t2=arg2.toString().split(".")[1].length
        }catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""))
        r2=Number(arg2.toString().replace(".",""))
        return (r1/r2)*pow(10,t2-t1);
        }
}

function Len(str)
{
    var i,sum;
    sum=0;
    for(i=0;i<str.length;i++)
    {
        if ((str.charCodeAt(i)>=0) && (str.charCodeAt(i)<=255))
            sum=sum+1;
        else
            sum=sum+2;
    }
    return sum;
}
	
	