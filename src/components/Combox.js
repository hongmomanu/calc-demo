import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
export function Combox({ options, setFunc, name,data, label = "",size,minWidth=120 }) {
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth}}>
      <Select size={size} value={data[name]} onChange={(e) => {
          const newData = {...data}
          newData[name] = e.target.value
          setFunc(newData)
      }} label={label}>
        {options.map((it,ix) => {
          return <MenuItem key={ix} value={it.value}>{it.name}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}
