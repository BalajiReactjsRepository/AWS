import moment from "moment";

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
        formDate: moment(dateRange[0].$d).format("DD-MMM-YYYY"),
        toDate: moment(dateRange[1].$d).format("DD-MMM-YYYY"),
      };
  }
};
