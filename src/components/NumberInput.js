import TextField from "@mui/material/TextField";
import { toFixed } from "../utils";
export function NumberInput({
  max = Infinity,
  min = -Infinity,
  step = 1,
  setFunc,
  name = "",
  data = null,
  disabled = false,
  type = "number",
  formaterFunc = (val)=>{return val},
  InputProps ={},
  label,
  deceil=undefined,
  paddingTop=0,
}) {
  return (
    <TextField
      onChange={(e) => {
        if (!setFunc) return;
        const newData = { ...data };
         if(e.target.value === newData[name]) return 
        // newData[name] = e.target.value===''?'':Number(e.target.value)
        newData[name] = e.target.value===''?null:Number(e.target.value);
        setFunc(newData);
      }}
      disabled={disabled}
      type={type}
      variant="filled"
      size="small"
      style={{ width: "100%"}}
      label= {label}
      InputProps={InputProps}
      inputProps={{
        style: {
          paddingTop: `${paddingTop}px`,
          textAlign: "center",
        },
        max,
        min,
        step,
      }}
      value={data == null ? undefined : formaterFunc(toFixed(data[name],deceil))}
    />
  );
}
