import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import usePrevious from "../../../hooks/use-previous";
import { httpPost } from "../../../http";

export default function ConeCoils() {
  return (
    <Grid container>
      <ConeTable />
      <ElbowTable />
      <DiaphragmTable />
      <BlendTable />
      <CoilsTable />
      <MultipleApi />
      <div>未完待续</div>  
    </Grid>
  );
}



function TableApi({setCalcFormData,calcFormData,old_unit,url}){
    if(old_unit)calcFormData.old_unit=old_unit

    httpPost({url,params:calcFormData}).then((rep)=>{
        setCalcFormData({...calcFormData,...rep})
    })
}
function MultipleApi(){
    const [calcFormData,setCalcFormData] = useState({
        d:300,
        r:450,
        re:50000,
        new_unit:'mm',
        old_unit:'mm',
      })
      const old_unit = usePrevious(calcFormData.new_unit)
      useEffect(()=>{
        TableApi({setCalcFormData,calcFormData,old_unit,url:'/api/pipe/special/k_Segments'})
      },[calcFormData.d,calcFormData.r,calcFormData.re,calcFormData.new_unit])
      return (
        <>
          <Grid item xs={12}>
            <div className="fl  f-a-c h-30">
            Multiple mitre bend
            </div>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Re</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "re",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
            </Grid>


          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Pipe diameter</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "new_unit",
                    setFunc: setCalcFormData,
                  })}</div>
            </Grid>

            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "d",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Radius of curv.</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{
                  calcFormData.new_unit
              }</div>
            </Grid>

            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "r",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K   2 cut bend</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.k2}</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K   3 cut bend</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.k3}</div>
            </Grid>
          </Grid>
        </>
      );
}
function CoilsTable() {

    const [calcFormData,setCalcFormData] = useState({
        d:300,
        r:450,
        e:9,
        type:2,
        el:23.8,
        ld:79.4,
        new_unit:'mm',
        old_unit:'mm',
        equivalent_unit:'m',
        
      })
      const old_unit = usePrevious(calcFormData.new_unit)
      useEffect(()=>{
        TableApi({setCalcFormData,calcFormData,old_unit,url:'api//pipe/special/ld_bend'})
      },[calcFormData.d,calcFormData.r,calcFormData.equivalent_unit,calcFormData.new_unit,calcFormData.e])  
      return (
        <>
          <Grid item xs={12}>
            <div className="fl  f-a-c h-30">
            {'Coils (1 < R/D < 20)'}
            </div>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Pipe diameter (D)</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "new_unit",
                    setFunc: setCalcFormData,
                  })}</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "d",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
            </Grid>


          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Radius of curv.</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{calcFormData.new_unit}</div>
            </Grid>

            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "r",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Number of 90° bends</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">#</div>
            </Grid>

            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "e",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>

    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">L/D</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.new_unit}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.ld}</div>
            </Grid>
          </Grid>
    
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Equivalent length</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "equivalent_unit",
                    setFunc: setCalcFormData,
                  })}</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.el}</div>
            </Grid>
          </Grid>
        </>
      );

}

function BlendTable() {

    const [calcFormData,setCalcFormData] = useState({
        d:300,
        r:1500,
        e:1,
        type:1,
        el:7.0,
        ld:23.4,
        new_unit:'mm',
        old_unit:'mm',
        equivalent_unit:'m',
        
      })
      const old_unit = usePrevious(calcFormData.new_unit)
      useEffect(()=>{
        TableApi({setCalcFormData,calcFormData,old_unit,url:'api//pipe/special/ld_bend'})
      },[calcFormData.d,calcFormData.r,calcFormData.equivalent_unit,calcFormData.new_unit])  
      return (
        <>
          <Grid item xs={12}>
            <div className="fl  f-a-c h-30">
            {'Bend 90° 1 < R/D < 20 '}
            </div>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Pipe diameter (D)</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "new_unit",
                    setFunc: setCalcFormData,
                  })}</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "d",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
            </Grid>


          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Radius of curv. (R)</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{calcFormData.new_unit}</div>
            </Grid>

            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "r",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>

    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">L/D</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.new_unit}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.ld}</div>
            </Grid>
          </Grid>
    
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Equivalent length</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "equivalent_unit",
                    setFunc: setCalcFormData,
                  })}</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.el}</div>
            </Grid>
          </Grid>
        </>
      );

}

function DiaphragmTable(){
    const [calcFormData,setCalcFormData] = useState({
        d:50,
        d0:30,
        k1:11.22,
        k2:12.63,
        k3:6.31,
        k4:10.82,
        e:10,
        new_unit:'mm',
        old_unit:'mm',
        
      })
      const old_unit = usePrevious(calcFormData.new_unit)
      useEffect(()=>{
        TableApi({setCalcFormData,calcFormData,old_unit,url:'/api/pipe/special/k_diaphragm'})
      },[calcFormData.d0,calcFormData.d,calcFormData.e,calcFormData.new_unit])  
      return (
        <>
          <Grid item xs={12}>
            <div className="fl  f-a-c h-30">
            Diaphragm
            </div>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Pipe diameter (D)</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "new_unit",
                    setFunc: setCalcFormData,
                  })}</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "d",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Orifice diameter (Do)</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.new_unit}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                  data: calcFormData,
                  name: "d0",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K (thin diaphr)</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.k1}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K (thin diaphr) G1102</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.k2}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K (thick diaphr) G1102</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.k3}
              </div>
            </Grid>
          </Grid>
    
    
          <Grid container  style={{marginTop:'16px'}} >
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Thickness</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.new_unit}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                  data: calcFormData,
                  name: "e",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K (thin diaphr)</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.k4}</div>
            </Grid>
          </Grid>
    
        </>
      );

}


function ElbowTable() {

    const [calcFormData,setCalcFormData] = useState({
        alpha:90,
        d:300,
        r:450,
        new_unit:'mm',
        old_unit:'mm',
        rug:.1,
        re:10000,
        k:.340,
      })
      const old_unit = usePrevious(calcFormData.new_unit)
      useEffect(()=>{
        TableApi({setCalcFormData,calcFormData,old_unit,url:'api/pipe/special/k_elbow'})
      },[calcFormData.alpha,calcFormData.d,calcFormData.r,calcFormData.rug,calcFormData.re,calcFormData.new_unit])  
      return (
        <>
          <Grid item xs={12}>
            <div className="fl  f-a-c h-30">
            Elbow (R/D>1.5, laminar and turbulent flow)
            </div>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Alpha</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">degree</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
                  data: calcFormData,
                  name: "alpha",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Pipe diameter</div>
            </Grid>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                  data: calcFormData,
                  name: "d",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Radius of curv.</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.new_unit}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                  data: calcFormData,
                  name: "r",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Roughness</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.new_unit}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                  data: calcFormData,
                  name: "rug",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Reynolds</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                  data: calcFormData,
                  name: "re",
                  setFunc: setCalcFormData,
                })}</div>
            </Grid>
          </Grid>
    
          <Grid container>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              -
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.k}</div>
            </Grid>
          </Grid>
    
        </>
      );

}

function ConeTable() {
  const [calcFormData,setCalcFormData] = useState({
    beat:40,
    d1:300,
    d2:500,
    new_unit:'mm',
    old_unit:'mm',
    k1:.364,
    k2:2.810
  })
  const old_unit = usePrevious(calcFormData.new_unit)
  useEffect(()=>{
    TableApi({setCalcFormData,calcFormData,old_unit,url:'api/pipe/special/k_cone'})
  },[calcFormData.beat,calcFormData.d1,calcFormData.d2,calcFormData.new_unit])  
  return (
    <>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">
          Cone and abrupt expansion/contraction
        </div>
      </Grid>
      <Grid container>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Beta (b)</div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">degree</div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">{NumberInput({
              data: calcFormData,
              name: "beat",
              setFunc: setCalcFormData,
            })}</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Inlet diameter</div>
        </Grid>
        <Grid item xs={4}>
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
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
              data: calcFormData,
              name: "d1",
              setFunc: setCalcFormData,
            })}</div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Outlet diameter</div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.new_unit}
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
              data: calcFormData,
              name: "d2",
              setFunc: setCalcFormData,
            })}</div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K1</div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.k1}</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K2</div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.k2}</div>
        </Grid>
      </Grid>

    </>
  );
}
