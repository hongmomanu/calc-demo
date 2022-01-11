import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { LoadingButton } from "@mui/lab";
import usePrevious from "../../../hooks/use-previous";


function calcApi({setCalcFormData,calcFormData,cvkey,dkey,type,old_unit,kkey}){
    calcFormData.ckv = calcFormData[cvkey]
    calcFormData.d = calcFormData[dkey]
    calcFormData.type = type
    if(old_unit)calcFormData.old_unit=old_unit

    httpPost({url:'api/pipe/fitting/fitting_values',params:calcFormData}).then((rep)=>{
        rep[kkey] = rep.k
        setCalcFormData({...calcFormData,...rep})
    })
}

export default function Fittings() {
  const [calcFormData, setCalcFormData] = useState({
    cv: 3700,
    cvm:860,
    kv:2682,
    kvf:44430,
    d:.25,
    cd:.25,
    md:.25,
    kd:.25,
    kfd:.25,
    kcv:.61,
    kcvm:.83,
    kkv:.87,
    kkvf:.88,
    new_unit:'mm',
    old_unit:'mm'

  });
  const old_unit = usePrevious(calcFormData.new_unit)
  useEffect(()=>{
    const newData = {...calcFormData}
    calcApi({calcFormData:newData,setCalcFormData,cvkey:'cv',dkey:'cd',type:1,old_unit,kkey:'kcv'})
  },[calcFormData.cv,calcFormData.cd,calcFormData.new_unit])

  useEffect(()=>{
    const newData = {...calcFormData}
    calcApi({calcFormData:newData,setCalcFormData,cvkey:'cvm',dkey:'md',type:2,old_unit,kkey:'kcvm'})
  },[calcFormData.cvm,calcFormData.md,calcFormData.new_unit])

  useEffect(()=>{
    const newData = {...calcFormData}
    calcApi({calcFormData:newData,setCalcFormData,cvkey:'kv',dkey:'kd',type:3,old_unit,kkey:'kkv'})
  },[calcFormData.kv,calcFormData.kd,calcFormData.new_unit])

  useEffect(()=>{
    const newData = {...calcFormData}
    calcApi({calcFormData:newData,setCalcFormData,cvkey:'kvf',dkey:'kfd',type:4,old_unit,kkey:'kkvf'})
  },[calcFormData.kvf,calcFormData.kfd,calcFormData.new_unit])

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from CV (US Units)</div>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">CV</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">gpm - 1 psi</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "m", value: "m" },
                  { name: "mm", value: "mm" },
                  { name: "inch", value: "inch" },
                  { name: "ft", value: "ft" },
                ],
                data: calcFormData,
                name: "new_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.kcv}
          </div>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from CVm (Metric Units)</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">CVm</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">m3/h - 1 mH20</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cvm",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "md",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kcvm",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>



      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from KV</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">KV (flow factor)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">m3/h - 1 bar</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kkv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>


      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from KV (French)</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">KV</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">l/min - 1 bar</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kvf",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kfd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kkvf",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>


      


    </Grid>
  );
}
