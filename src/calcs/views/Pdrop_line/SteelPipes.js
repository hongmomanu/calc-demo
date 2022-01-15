import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { RadioGroups } from "../../../components/RadioGroup";
import { httpPost } from "../../../http";
import { RADIO_MAP } from "./datas";

export default function SteelPipes() {
  const [calcFormData, setCalcFormData] = useState({
    chooseVal:5,
    inches_inside:[],
    inches_wall:[],
    mm_inside:[],
    mm_wall:[]
  });
  useEffect(()=>{
    calcApi({calcFormData,setCalcFormData,de_inch:inchersArr,ep:RADIO_MAP[calcFormData.chooseVal]})
  },[calcFormData.chooseVal])
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">Dimensions of Steel pipes</div>
      </Grid>

      <Grid item xs={12}>
        <RadioGroups
          row={true}
          value={calcFormData.chooseVal}
          label="Schedule"
          data={calcFormData}
          name={"chooseVal"}
          options={[
            {
              label: "STD",
              value: 1,
            },
            {
              label: "xs",
              value: 2,
            },
            {
              label: "xxs",
              value: 3,
            },
            {
              label: "5",
              value: 4,
            },
            {
              label: "10",
              value: 5,
            },
            {
              label: "20",
              value: 6,
            },
            {
              label: "30",
              value: 7,
            },
            {
              label: "40",
              value: 8,
            },
            {
              label: "60",
              value: 9,
            },
            {
              label: "80",
              value: 10,
            },
            {
              label: "100",
              value: 11,
            },
            {
              label: "120",
              value: 12,
            },
            {
              label: "140",
              value: 13,
            },
            {
              label: "160",
              value: 14,
            },
            {
              label: "5S",
              value: 15,
            },
            {
              label: "10S",
              value: 16,
            },
            {
              label: "40S",
              value: 17,
            },
            {
              label: "80S",
              value: 18,
            },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid container spacing={2} direction="row">
        <Grid item xs={6}>
          <Grid item xs={12}>
            <div className="fl  f-a-c h-30">Inches</div>
          </Grid>
          <Grid container direction="row">
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">NPS</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">Outside Diameter</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">Inside Diameter</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">Wall Thickness</div>
            </Grid>
          </Grid>
          {inchesRender(calcFormData.inches_inside,calcFormData.inches_wall)}
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <div className="fl  f-a-c h-30">mm</div>
          </Grid>
          <Grid container direction="row">
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">DN</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">Outside Diameter</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">Inside Diameter</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">Wall Thickness</div>
            </Grid>
          </Grid>
          {mmRender(calcFormData.mm_inside,calcFormData.mm_wall)}
        </Grid>
      </Grid>
    </Grid>
  );
}

function calcApi({calcFormData,setCalcFormData,de_inch=[],ep=[]}) {
    httpPost({url:'/api/line/steel/btn_sch',params:{de_inch,ep}}).then((rep)=>{
        setCalcFormData({...calcFormData,...rep})
    })
}
const NPS = ['1/8','1/4','3/8','1/2','3/4','1','1-1/4','1-1/2','2','2-1/2','3','3-1/2','4','5','6','8','10','12','14','16','18','20','22','24','26','28','30','32','34','36','38','40','42','44','46','48']
const inchersArr =[0.405,0.54,0.675,0.84,1.05,1.315,1.66,1.9,2.375,2.875,3.5,4,4.5,5.563,6.625,8.625,10.75,12.75,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48]
const DNS = ['','',10,15,20,25,32,40,50,65,80,'',100,125,150,200,250,300,350,400,450,500,550,600,'',700,'',800,'',900,'',1000,1100,'','',1200]
const mmArr = [10.29,13.72,17.15,21.34,26.67,33.40,42.16,48.26,60.33,73.03,88.90,101.60,114.30,141.30,168.28,219.08,273.05,323.85,355.60,406.40,457.20,508.00,558.80,609.60,660.40,711.20,762.00,812.80,863.60,914.40,965.20,1016.00,1066.80,1117.60,1168.40,1219.20]
function inchesRender(insides=[],walls=[]){
    return NPS.map((it,ix)=>{
        return (
            <Grid key={ix} container direction="row">
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{it}</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{inchersArr[ix]}</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{insides[ix]||''}</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{walls[ix]||''}</div>
            </Grid>
          </Grid>
        )
    })
}
function mmRender(insides=[],walls=[]){
    return DNS.map((it,ix)=>{
        return (
            <Grid key={ix} container direction="row">
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{it}</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{mmArr[ix]}</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{insides[ix]||''}</div>
            </Grid>
            <Grid item xs={3}>
                <div className="fl f-a-c f-j-c h-30 b-1-gray">{walls[ix]||''}</div>
            </Grid>
          </Grid>
        )
    })

}
