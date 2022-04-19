import { Tooltip } from "@mui/material";

export function toFixed(val,size=4){
  if(val == null) return ''
  var target = `^\\D*(\\d*(?:\\.\\d{0,${size}})?).*$`;
  const reg = new RegExp(target, "g");
  const val_str = `${val}`
  if(val_str.slice(val_str.length-1) === '.')return val
  if(val_str.slice(val_str.length-1) === '-')return val
  return val?((Math.sign(val)===-1?'-':'')+ `${val}`.replace(reg, '$1')):val
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
      return (<Tooltip arrow={true} title={val||''} placement="right">
    <span>{toFixed(val,size)}</span>
  </Tooltip>)
    }else{
      return  toFixed(val,size)
    }
  }