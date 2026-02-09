import WeatherTable from "./tables/ReportsTable.jsx";

import GeneralFilters from "./filters/GeneralFilters";
import SummaryStationFilter from "./filters/SummaryStationFilter.jsx";
import SummaryReportTable from "./tables/SummaryReportTable.jsx";
import RainGuageFilters from "./filters/RainGuageFilters.jsx";

export const reportTypeConfig = {
  gn: {
    renderFilters: (props) => <GeneralFilters {...props} />,
    TableComponent: (props) => <WeatherTable {...props} />,
  },
  rwl: {
    renderFilters: (props) => <SummaryStationFilter {...props} />,
    TableComponent: (props) => <SummaryReportTable {...props} />,
  },
  ws: {
    renderFilters: (props) => <SummaryStationFilter {...props} />,
    TableComponent: (props) => <SummaryReportTable {...props} />,
  },
  gd: {
    renderFilters: (props) => <SummaryStationFilter {...props} />,
    TableComponent: (props) => <SummaryReportTable {...props} />,
  },
  rgs: {
    renderFilters: (props) => <RainGuageFilters {...props} />,
    TableComponent: (props) => <SummaryReportTable {...props} />,
  },
};
