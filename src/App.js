import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListItemButton from "@mui/material/ListItemButton";
import MailIcon from "@mui/icons-material/Mail";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Content from "./Content";
import "./App.css";

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [open, setOpen] = React.useState(true);
  const [navIndex, setNavIndex] = React.useState(0);
  const handleClick = () => {
    setOpen(!open);
  };
  const navClick = (index) => {
    setNavIndex(index);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          {/* <Toolbar>
          <Typography variant="h6" noWrap component="div">
            标题栏
          </Typography>
        </Toolbar> */}
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {/* <Toolbar /> */}
          <Divider />
          <List>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="计算工具" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => navClick(0)}
                  selected = {0===navIndex}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Valves" />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navClick(1)}
                  selected = {1===navIndex}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Pdrop_pipe" />
                </ListItemButton>

              </List>
            </Collapse>
          </List>
          <Divider />
          <List>
            <ListItem button key={2}>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary={"测试1"} />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          {/* <Toolbar /> */}
          <Content navIndex={navIndex} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default App;
