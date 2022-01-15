import TextField from "@mui/material/TextField";
export function NumberInput({max=Infinity,min=-Infinity,step=1,setFunc, name='',data=null,disabled=false,type="number"}){
    return <TextField
            onChange={(e) => {
                if(!setFunc)return
                const newData = {...data}
                newData[name] = Number(e.target.value)
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
            value={data==null?undefined:`${data[name]}`.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')}
          />
}