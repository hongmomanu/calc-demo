import React, { useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
export default function Vapour() {
    const [calcFormData, setCalcFormData] = useState({
        temp_unit:'°C',
    })
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">
          Models for vapour flow through a pipe
        </div>
      </Grid>

      <Grid item xs={12} container direction="row">
        <Grid item xs={8}>
          <TableOne calcFormData={calcFormData} setCalcFormData={setCalcFormData}/>
        </Grid>

        <Grid item xs={4}></Grid>
      </Grid>
    </Grid>
  );
}

function TableOne({calcFormData,setCalcFormData}) {
  return (
    <Grid container direction="row">
      <Grid item xs={10}>
        <Grid container direction="row">
          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Temperature in</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({options:[
                    {name:'°C',value:'°C'},
                    {name:'K',value:'K'},
                    {name:'°F',value:'°F'},
                    {name:'R',value:'R'},
                    ],
                    data:calcFormData,
                    name:'temp_unit',
                    setFunc:setCalcFormData
                    })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">30</div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <span>cacl</span>
      </Grid>
    </Grid>
  );
}


