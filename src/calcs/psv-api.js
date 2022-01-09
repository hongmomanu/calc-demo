import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid,  Tooltip, Legend} from 'recharts';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function PsvSheet(){
    const [tabValue, setTabValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={24}>
              <Item>
                <IconLabelTabs tabValue={tabValue} handleChange ={handleChange}/>
              </Item>
            </Grid>
            <Grid item xs={24}>
                <Item>
                    <TabContent tabValue={tabValue} />
                </Item>
            </Grid>
          </Grid>
        </Box>
      );
}
export default PsvSheet

function IconLabelTabs({tabValue,handleChange}) {
    
  
    return (
      <Tabs value={tabValue} onChange={handleChange} aria-label="icon label tabs example">
        <Tab icon={<CalculateIcon />} label="gas" />
        <Tab icon={<LocalGasStationIcon />} label="liq" />
        <Tab icon={<FireExtinguisherIcon />} label="steam" />
      </Tabs>
    );
  }

function TabContent({tabValue}){
    switch (tabValue) {
        case 0:
            return <Gas />
        default:
            return "未完待续"

    }
}

function Gas() {
    const [tableVals, setTableVals] = React.useState({ a: 1, b: 2, c: 1,x:2 })
    return <div className="app">
        <Grid item xs={24}>
            <ControlTable {...tableVals} setTableVals={setTableVals} />
        </Grid>
        <Grid item xs={24}>
            <Charts {...tableVals} />
        </Grid>
        
        <Grid item xs={24}>
          <Formula />
        </Grid>
  
    </div>
  }
  
  
  //表格控制
  function ControlTable({ a, b, c, setTableVals,x }) {
      return(<Grid container>
        <Grid item xs={4.5}>
            <div className="fl b-1-gray bg-y f-a-c h-30">Case study:</div>
        </Grid>
        <Grid item xs={7.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>

        <Grid item xs={6}>
            <div className="fl b-1-gray bg-y f-a-c h-30">Patm=1.01325(bar)/14.696(psi)</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Case 1</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Case 2</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Case 3</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Case 4</div>
        </Grid>

        <Grid item xs={4.5}>
            <div className="fl b-1-gray bg-y f-a-c h-30">Set pressure of the Psv(Pset):</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl b-1-gray f-a-c h-30 f-j-c">psig</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray f-j-c">28</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={4.5}>
            <div className="fl b-1-gray bg-y f-a-c h-30">Set pressure of the Psv(Pset):</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl b-1-gray f-a-c h-30 f-j-c">psig</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray f-j-c">28</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>

        <Grid item xs={4.5}>
            <div className="fl b-1-gray bg-y f-a-c h-30">Set pressure of the Psv(Pset):</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl b-1-gray f-a-c h-30 f-j-c">psig</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray f-j-c">28</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>

        <Grid item xs={4.5}>
            <div className="fl b-1-gray bg-y f-a-c h-30">Set pressure of the Psv(Pset):</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl b-1-gray f-a-c h-30 f-j-c">psig</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray f-j-c">28</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>

        <Grid item xs={4.5}>
            <div className="fl b-1-gray bg-y f-a-c h-30">Set pressure of the Psv(Pset):</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl b-1-gray f-a-c h-30 f-j-c">psig</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray f-j-c">28</div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
            <div className="fl f-a-c h-30 b-1-gray"></div>
        </Grid>
      </Grid>)
    
  }
  //曲线
  function Charts({ a, b, c }) {
    // const x_arr = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5]
    // const data = []
    // x_arr.forEach((it)=>{
    //   const item  = {name:it,value:a*Math.pow(it,2)+b*it+c*1}
    //   data.push(item)
    // })
    const data = [
        {
          "name": "gas0",
          "uv": 4000,
          "pv": 2400,
          "amt": 2400
        },
        {
          "name": "gas1",
          "uv": 3000,
          "pv": 1398,
          "amt": 2210
        },
        {
          "name": "gas2",
          "uv": 2000,
          "pv": 9800,
          "amt": 2290
        },
        {
          "name": "gas3",
          "uv": 2780,
          "pv": 3908,
          "amt": 2000
        },
        {
          "name": "gas4",
          "uv": 1890,
          "pv": 4800,
          "amt": 2181
        },
        {
          "name": "gas5",
          "uv": 2390,
          "pv": 3800,
          "amt": 2500
        },
        {
          "name": "gas6",
          "uv": 3490,
          "pv": 4300,
          "amt": 2100
        }
      ]
      
                                  
      
    
    return  (<Box style={{marginTop:'30px'}} sx={{ flexGrow: 1 }}><Grid container spacing={1}>
                <LineChart width={730} height={250} data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
        </Grid></Box>)
        
  }
  //公式
  function Formula(){
      return ''
    // return <div className="formula fl f-1 f-d-c">
    //   <div className="fl f-1 f-a-c f-j-c">{" \\(y = ax^2 + bx + c\\)  。当 \\(a \\ne 0\\) 时"}</div>
    //   <div className="fl f-1 f-a-c f-j-c" style={{marginTop:'50px'}}>{"\\[x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\\]"}</div>
      
    // </div>
  }

  