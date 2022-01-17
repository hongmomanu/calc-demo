import TextField from "@mui/material/TextField";
import { toFixed } from "../utils";
export function NumberInput({max=Infinity,min=-Infinity,step=1,setFunc, name='',data=null,disabled=false,type="number"}){
    return <TextField
            onChange={(e) => {
                if(!setFunc)return
                const newData = {...data}
                console.log("e.target.value",e.target.value)
                // newData[name] = e.target.value===''?'':Number(e.target.value)
                newData[name] = e.target.value
                setFunc(newData)
            }}
            disabled={disabled}
            type={type}
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
              max,
              min,
              step,
            }}
            value={data==null?undefined:toFixed(data[name])}
          />
}