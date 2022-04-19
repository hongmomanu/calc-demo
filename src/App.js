import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import PropTypes from "prop-types";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListItemButton from "@mui/material/ListItemButton";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import AirplaneTicket from "@mui/icons-material/AirplaneTicket";
import Adjust from "@mui/icons-material/Adjust";
import Airplay from "@mui/icons-material/Airplay";
import AutofpsSelect from "@mui/icons-material/AutofpsSelect";
import AirportShuttle from "@mui/icons-material/AirportShuttle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import {
  createTheme,
  ThemeProvider,
  styled,
  useTheme,
} from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";
import Content from "./Content";
import "./App.css";
import { Typography, useScrollTrigger } from "@mui/material";

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const NavData = [
  {
    idx: 0,
    name: "Valves",
    icon: <AirplaneTicket />,
  },
  {
    idx: 1,
    name: "Pdrop_pipe",
    icon: <StarBorder />,
  },
  {
    idx: 2,
    name: "Pdrop_line",
    icon: <Adjust />,
  },
  {
    idx: 3,
    name: "Psv_scenarious",
    icon: <Airplay />,
  },
  {
    idx: 4,
    name: "Psv_iso",
    icon: <AutofpsSelect />,
  },
  {
    idx: 5,
    name: "Psv_Api_New",
    icon: <AirportShuttle />,
  },
  {
    idx: 6,
    name: "liquid_spray",
    icon: <AddReactionIcon />,
  },
];

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: "50px",
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

function App() {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const [drawOpen, setDrawOpen] = React.useState(true);
  const [navIndex, setNavIndex] = React.useState(0);
  const handleDrawerOpen = () => {
    setDrawOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawOpen(false);
  };
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
          sx={
            drawOpen && {
              width: `calc(100% - ${drawerWidth}px)`,
              ml: `${drawerWidth}px`,
            }
          }
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(drawOpen && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              化工计算表格
           </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          open={drawOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>

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
                {NavData.map((it, ix) => {
                  return (
                    <ListItemButton
                      key={ix}
                      onClick={() => navClick(it.idx)}
                      selected={it.idx === navIndex}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>{it.icon}</ListItemIcon>
                      <ListItemText primary={it.name} />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          </List>
          <Divider />
          <List></List>
        </Drawer>
        <Main open={drawOpen}>
          <div id="back-to-top-anchor"></div>
          <Content navIndex={navIndex} />
        </Main>

        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Box>
    </ThemeProvider>
  );
}
export default App;
