import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixedTip } from "../../../utils";
import CalculateIcon from "@mui/icons-material/Calculate";
import { RadioGroups } from "../../../components/RadioGroup";

const caseArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const neededKeys = [
  "rho",
  "mu",
  "massfl",
  "gas",
  "pres_in",
  "diam",
  "ltuy",
  "rug",
];
function getAplWater(params){
  return httpPost({
      url: "/api/pipe/dp/select_water_steam",
      params,
      nofilter: true,
    })
}
function ShowDialog2({open, setOpen, setCalcFormData, setCidex, calcFormData }) {
  const [paramForm, setParamForm] = useState({
    case: 0,
    pressure: 5,
    temp: 0,
  });
  useEffect(()=>{
    getAplWater({
      visc_unit:calcFormData.visc_unit,
      pres_unit:calcFormData.pres_unit,
      rho_unit:calcFormData.rho_unit,
      type:0
  }).then((rep) => {
    setParamForm({...paramForm,...rep})
  })
  },[])
  return <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Water properties</DialogTitle>
          <DialogContent>
            <DialogContentText>Thermodynamic state by Case</DialogContentText>
            {Combox({
              size:'large',
              options: [
                { name: "Case 1", value: 0 },
                { name: "Case 2", value: 1 },
                { name: "Case 3", value: 2 },
                { name: "Case 4", value: 3 },
                { name: "Case 5", value: 4 },
                { name: "Case 6", value: 5 },
                { name: "Case 7", value: 6 },
                { name: "Case 8", value: 7 },
                { name: "Case 9", value: 8 },
                { name: "Case 10", value: 9 },
                { name: "Case 11", value: 10 },
                { name: "Case 12", value: 11 },
                { name: "Case 13", value: 12 },
                { name: "Case 14", value: 13 },
                { name: "Case 15", value: 14 },
              ],
              data: paramForm,
              name: "case",
              setFunc: setParamForm,
            })}
            <NumberInput
              data={paramForm}
              label={`Pressure (${paramForm.pressure_unit})`}
              name="pressure"
              setFunc={setParamForm}
            />
            <NumberInput
              data={paramForm}
              label={`Temperature (${paramForm.temperature_unit})`}
              name="temp"
              setFunc={setParamForm}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                getAplWater({
                    p:Number(paramForm.pressure),
                    t:Number(paramForm.temp),
                    visc_unit:calcFormData.visc_unit,
                    pres_unit:calcFormData.pres_unit,
                    rho_unit:calcFormData.rho_unit,
                    type:1
                }).then((rep) => {
                    
                    const data = {}
                    for(let key in rep){
                        if(rep.hasOwnProperty(key)){
                            
                            if(key === 'lv'){
                              data[`gas${paramForm.case+1}$`] = rep[key]
                            }else{
                              data[`${key}${paramForm.case+1}$`] = rep[key]
                            }
                        }
                    }
                    console.log('data',data)
                    setCalcFormData({...calcFormData,...data})
                    console.log('getAplWater rep',rep)
                  })
              }}
            >
              Ok
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
}
function ShowDialog({ open, setOpen, setCalcFormData, setCidex }) {
  const [paramForm, setParamForm] = useState({
    elements: [
      { name: "Case 1", value: 0 },
      { name: "Case 2", value: 1 },
      { name: "Case 3", value: 2 },
      { name: "Case 4", value: 3 },
      { name: "Case 5", value: 4 },
      { name: "Case 6", value: 5 },
      { name: "Case 7", value: 6 },
      { name: "Case 8", value: 7 },
      { name: "Case 9", value: 8 },
      { name: "Case 10", value: 9 },
      { name: "Case 11", value: 10 },
      { name: "Case 12", value: 11 },
      { name: "Case 13", value: 12 },
      { name: "Case 14", value: 13 },
      { name: "Case 15", value: 14 },
    ],
    currentelement: 0,
    diameters: [],
    currentdiam: 1,
    currentisch: 1,
  });
  useEffect(() => {
    httpPost({
      url: "/api/pipe/dp/selectStandard",
      params: {},
      nofilter: true,
    }).then((rep) => {
      setParamForm((data)=>{
        return { ...data, ...rep }
        });

    });
  }, []);
  useEffect(()=>{
    httpPost({
        url: "/api/pipe/dp/select_pipe",
        params: {idiam:paramForm.currentdiam,isch:paramForm.currentisch},
        nofilter: true,
      }).then((rep) => {
        console.log('rep,rep',rep)
        setParamForm((data)=>{
            return {...data,...rep}
        });
      });
  },[paramForm.currentdiam,paramForm.currentisch])
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Standard diameter selection for Element</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="standard">
          <DialogContentText>choose element </DialogContentText>
          <Combox
            options={paramForm.elements}
            data={paramForm}
            name={"currentelement"}
            setFunc={setParamForm}
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <DialogContentText>Pipe diameter </DialogContentText>
              <Combox
                options={paramForm.diameters.map((it) => {
                  return { name: it.idiamName, value: it.idiam };
                })}
                data={paramForm}
                name={"currentdiam"}
                setFunc={setParamForm}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <DialogContentText>Pipe Schedule </DialogContentText>
              <Combox
                options={paramForm.diameters
                  .find((it) => it.idiam)
                  ?.schedules?.map((it) => {
                    return { name: it.ischName, value: it.isch };
                  })}
                data={paramForm}
                name={"currentisch"}
                setFunc={setParamForm}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            inch
          </Grid>
          <Grid item xs={4}>
            mm
          </Grid>

          <Grid item xs={4}>
            External diameter
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.inchExternalDiameter)}
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.mmExternalDiameter)}
          </Grid>

          <Grid item xs={4}>
            Thickness
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.inchThickness)}
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.mmThickness)}
          </Grid>

          <Grid item xs={4}>
            Internal Diameter
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.inchInternalDiameter)}
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.mmInternalDiameter)}
          </Grid>
        </Grid>

    

        
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            setCalcFormData((data)=>{
                const result = {...data}
                console.log('result',result,paramForm.currentelement)
                result[`diam${paramForm.currentelement+1}$`] = paramForm.mmInternalDiameter
                setCidex(paramForm.currentelement+1);
                return {...result}
            })
          }}
        >
          Ok
        </Button>
        <Button onClick={() => {
            setOpen(false)
            

        }}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
function calcApi({ setCalcFormData, calcFormData, cIdx, setIsCalcing }) {
  const params = {};
  setIsCalcing(true);
  for (let key in calcFormData) {
    if (key.includes(cIdx) || !key.includes("$")) {
      const realKey = key.replace(`${cIdx}`, "");
      const realVal = calcFormData[key];
      if (neededKeys.includes(realKey) && realVal == null) return;
      params[realKey] = calcFormData[key];
    }
  }

  params[`gas`] = (params[`gas`]||'').toLocaleLowerCase() === "v" ? true : false;
  httpPost({
    url: "/api/pipe/dp/dp_calc",
    params,
    nofilter: true,
  })
    .then((rep) => {
      const reps = {};
      for (let key in rep) {
        reps[`${key}${cIdx}`] = rep[key];
      }
      setCalcFormData({ ...calcFormData, ...reps });
    })
    .finally(() => {
      setIsCalcing(false);
    });
}
const debCalcApi = debounce(calcApi);

function Dp() {
  const [isCalcing, setIsCalcing] = useState(false);
  const [calcFormData, setCalcFormData] = useState({
    rho_unit: "kg/m3",
    visc_unit: "mN.s/m2",
    massfl_unit: "kg/h",
    volfl_unit: "m3/h",
    pres_unit: "bara",
    d_unit: "mm",
    l_unit: "m",
    rug_unit: "mm",
    vel_unit: "m/s",
    dpu_unit: "bar/m",
    dp_unit: "bar",
    power_unit: "kW",
    rho1$: 9.04,
    mu1$: 0.013,
    massfl1$: 333.852845267824,
    gas1$: "V",
    pres_in1$: 8,
    diam1$: 26.65,
    ltuy1$: 100,
    rug1$: 0.05,
  });
  const [cIdx, setCidex] = useState(1);
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  useEffect(() => {
    calcApi({ calcFormData, setCalcFormData, cIdx: `${cIdx}$`, setIsCalcing });
  }, []);
  //   useEffect(()=>{
  //     debCalcApi({calcFormData,setCalcFormData,cIdx:`${cIdx}$`})
  //   },[cIdx, calcFormData.rho_unit, calcFormData.visc_unit,
  //      calcFormData.massfl_unit,calcFormData.volfl_unit, calcFormData.pres_unit,
  //     calcFormData.d_unit, calcFormData.l_unit,calcFormData.rug_unit,calcFormData.vel_unit,
  // calcFormData.dpu_unit,calcFormData.power_unit,calcFormData.dp_unit])
  return (
    <div style={{ overflow: "auto" }}>
      <Grid container width={"130%"}>
        <Grid item xs={2}>
          <div className="fl  f-a-c h-30">Downstream to upstream</div>
        </Grid>
        <Grid item xs={6}>
          <div className="fl f-a-c f-wrap">
            <LoadingButton
              loading={isCalcing}
              loadingPosition="start"
              startIcon={<CalculateIcon />}
              // size="large"
              style={{ width: "150px"}}
              onClick={() => {
                calcApi({
                  calcFormData,
                  setCalcFormData,
                  cIdx: `${cIdx}$`,
                  setIsCalcing,
                });
              }}
              variant="contained"
            >
              计算
            </LoadingButton>
            <Button
              variant="outlined"
              onClick={() => {
                console.log("xxx");
                setOpen1(true)
              }}
            >
              Select standard diam
            </Button>
            <ShowDialog {...{ open:open1, setOpen:setOpen1, setCalcFormData, setCidex }} />
            <Button
              variant="outlined"
              onClick={() => {
                setOpen2(true)
              }}
            >
              Water/Steam properties
            </Button>
            <ShowDialog2 {...{ open:open2, setOpen:setOpen2, setCalcFormData, setCidex, calcFormData }} />
            <Button
              variant="outlined"
              onClick={() => {
                console.log("xxx");
              }}
            >
              Adjust diameter for DP target
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                console.log("xxx");
              }}
            >
              Adjust flow for DP target
            </Button>
          </div>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Fluid</div>
        </Grid>
        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{`Case${it}$`}</div>
            </Grid>
          );
        })}
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Density</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/m3", value: "kg/m3" },
                { name: "kg/l", value: "kg/l" },
                { name: "lb/gal", value: "lb/gal" },
                { name: "lb/ft3", value: "lb/ft3" },
              ],
              data: calcFormData,
              name: "rho_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `rho${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Viscosity</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "N.s/m2", value: "N.s/m2" },
                { name: "mPa.s", value: "mPa.s" },
                { name: "mN.s/m2", value: "mN.s/m2" },
                { name: "cP", value: "cP" },
              ],
              data: calcFormData,
              name: "visc_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `mu${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Mass flow</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/h", value: "kg/h" },
                { name: "kg/s", value: "kg/s" },
                { name: "lb/h", value: "lb/h" },
                { name: "t/h", value: "t/h" },
              ],
              data: calcFormData,
              name: "massfl_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `massfl${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">or volume flow</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m3/h", value: "m3/h" },
                { name: "m3/s", value: "m3/s" },
                { name: "gal/h", value: "gal/h" },
                { name: "gpm", value: "gpm" },
              ],
              data: calcFormData,
              name: "volfl_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `volfl${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Fluid type (L or V)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                <TextField
                  onChange={(e) => {
                    const val = {};
                    val[`gas${it}$`] = e.target.value;
                    setCalcFormData({ ...calcFormData, ...val });
                  }}
                  variant="filled"
                  size="small"
                  style={{ width: "100%" }}
                  inputProps={{
                    style: {
                      paddingTop: "0px",
                      textAlign: "center",
                    },
                  }}
                  value={calcFormData[`gas${it}$`]}
                />
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Inlet pressure (optionnal for L)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "bar", value: "bar" },
                { name: "psi", value: "psi" },
                { name: "bara", value: "bara" },
                { name: "psia", value: "psia" },
                { name: "psig", value: "psig" },
                { name: "barg", value: "barg" },
              ],
              data: calcFormData,
              name: "pres_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `pres_in${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <div className="fl f-a-c h-30">Pipe</div>
        </Grid>

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Pipe inside diameter
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "d_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `diam${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Pipe length</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "l_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `ltuy${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Roughness</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "rug_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `rug${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Fittings/valves equiv. length (L/D)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `lequ${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Fittings/valves velocity head (K)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `k${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Transition Reynolds (default=2100)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `relam${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <div className="fl f-a-c h-30">Results</div>
        </Grid>

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Total length</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.l_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`ldevtot${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Velocity in</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m/s", value: "m/s" },
                { name: "cm/s", value: "cm/s" },
                { name: "ft/s", value: "ft/s" },
              ],
              data: calcFormData,
              name: "vel_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`veloc${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Velocity out (V only)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vel_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`veloc_out${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Critical velocity (V only)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vel_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`critv${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Reynolds</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`re${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Regime</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData[`regime${it}$`]}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Fanning friction factor
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`f${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Unit pressure drop (DPU)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "bar/m", value: "bar/m" },
                { name: "mbar/m", value: "mbar/m" },
                { name: "psi/ft", value: "psi/ft" },
              ],
              data: calcFormData,
              name: "dpu_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`dpu${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Pressure drop (DP)</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "bar", value: "bar" },
                { name: "psi", value: "psi" },
              ],
              data: calcFormData,
              name: "dp_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`dp${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Outlet pressure</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.pres_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`pres_out${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Power consumed</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "W", value: "W" },
                { name: "kW", value: "kW" },
                { name: "Btu/h", value: "Btu/h" },
                { name: "kcal/h", value: "kcal/h" },
              ],
              data: calcFormData,
              name: "power_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`power${it}$`])}
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
export default Dp;
