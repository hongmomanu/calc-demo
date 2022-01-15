import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
export function CheckedBox({setFunc, name='',data=null,label=""}){
    return <FormControlLabel control={<Checkbox checked={data[name]} onChange={(e)=>{
        if(!setFunc)return;
        const newData = {...data}
        newData[name] = e.target.checked
        setFunc(newData)
    }} />} label={label} />
}