import WeatherTable from "./tables/ReportsTable.jsx";

import GeneralFilters from "./filters/GeneralFilters";
import SummaryStationFilter from "./filters/SummaryStationFilter.jsx";
import SummaryReportTable from "./tables/SummaryReportTable.jsx";
import RainGuageFilters from "./filters/RainGuageFilters.jsx";
import moment from "moment";

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

export const getDatebyInputChange = (selectDateType, dateRange) => {
  switch (selectDateType.toLowerCase()) {
    case "today":
      return {
        formDate: moment().format("DD-MMM-YYYY"),
        toDate: moment().format("DD-MMM-YYYY"),
      };
    case "yesterday":
      const y = moment().subtract(1, "day").format("DD-MMM-YYYY");
      return { formDate: y, toDate: y };
    default:
      return {
        formDate: dateRange[0],
        toDate: dateRange[1],
      };
  }
};
