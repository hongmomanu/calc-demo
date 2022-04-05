import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
export function Combox({ options, setFunc, name,data, label = "",size }) {
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
