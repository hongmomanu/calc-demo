import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export function RadioGroups({label='',labelStyle=undefined, name,data,setFunc,options,row=false}){
    return <FormControl component="fieldset">
    <FormLabel style={labelStyle} component="legend">{label}</FormLabel>
    <RadioGroup
      row = {row}
      aria-label="gender"
      value={data[name]}
      onChange={(event) => {
        const newData = {...data}  
        newData[name] = event.target.value
        setFunc(newData)
      }}
      name={label}
    >
      {options.map((it,ix)=>{
          return <FormControlLabel
          key={ix}
          value={it.value}
          control={<Radio />}
          label={it.label}
        />
      })}  
    </RadioGroup>
  </FormControl>
}