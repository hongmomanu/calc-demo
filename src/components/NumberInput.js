import TextField from "@mui/material/TextField";
export function NumberInput({max=Infinity,min=-Infinity,step=1,setFunc, name,data}){
    return <TextField
            onChange={(e) => {
                const newData = {...data}
                newData[name] = Number(e.target.value)
                setFunc(newData)
            }}
            type="number"
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
            value={data[name]}
          />
}