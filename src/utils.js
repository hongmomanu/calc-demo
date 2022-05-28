import { Tooltip } from "@mui/material";

function roundFun(value, n) {
  return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
}
export function toFixed(val,size=4){
  if(val == null) return ''
  if(/\d*\.\d*0\b/.test(val))return val
  // var target = `^\\D*(\\d*(?:\\.\\d{0,${size}})?).*$`;
  // const reg = new RegExp(target, "g");
  // const val_str = toNonExponential(val) //`${val}`
  // if(val_str.slice(val_str.length-1) === '.')return val
  // if(val_str.slice(val_str.length-1) === '-')return val
  // return val?((Math.sign(val)===-1?'-':'')+ val_str.replace(reg, '$1')):val
  
  const val_str = toNonExponential(roundFun(val,size)) //`${val}`
  return val_str
}
export function toNonExponential(val) {
  var n = Number(val)
  var m = n.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  if(Array.isArray(m)){
    return n.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  }else{
    return `${val}`
  }
  
}

export function debounce (func, space = 200) {

    let timeout = null;
    return function (...params) {
  
      clearTimeout(timeout);
      timeout = setTimeout(
        () => func(...params),
        space
      );
  
    };
  
  }

  export function makeLineArr (data,limits,idx){
    // if(data[idx])
   

  }

  export function toFixedTip(val,size=4){
    if(val){
      return (<Tooltip arrow={true} title={toNonExponential(val)||''} placement="right">
    <span>{toFixed(val,size)}</span>
  </Tooltip>)
    }else{
      return  toFixed(val,size)
    }
  }