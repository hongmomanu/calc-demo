export function toFixed(val,size=4){
  var target = `^\\D*(\\d*(?:\\.\\d{0,${size}})?).*$`;
  const reg = new RegExp(target, "g");
  return val?`${val}`.replace(reg, '$1'):val
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