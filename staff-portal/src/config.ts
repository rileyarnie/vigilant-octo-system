const Config = {
  defaultPath: "/dashboard",
  basename: "/sims",
  layout: "vertical",
  collapseMenu: false,
  layoutType: "menu-dark",
  headerBackColor: "",
  fullWidthLayout: true,
  navFixedLayout: true,
  headerFixedLayout: true,
  baseUrl: {
    authnzSrv: 'http://localhost:1338/authnz-service/v0.0.1',
    timetablingSrv: 'http://localhost:1338/timetabling-service/0.0.1',
  },
};
export default Config;