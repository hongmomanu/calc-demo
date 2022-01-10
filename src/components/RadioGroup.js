import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export function RadioGroups({label='',name,data,setFunc,options}){
    return <FormControl component="fieldset">
    <FormLabel component="legend">{label}</FormLabel>
    <RadioGroup
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