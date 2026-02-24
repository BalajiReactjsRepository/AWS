import moment from "moment";

export const getDatebyInputChange = (selectDateType, dateRange) => {
  switch (selectDateType.toLowerCase()) {
    case "today":
      return {
        formDate: moment().format("DD-MMM-YYYY"),
        toDate: moment().format("DD-MMM-YYYY"),
      };

    case "yesterday":
      const x = moment().subtract(1, "day").format("DD-MMM-YYYY");
      return { formDate: x, toDate: x };
    case "last 7 days":
      return {
        formDate: moment().subtract(6, "days").format("DD-MMM-YYYY"),
        toDate: moment().format("DD-MMM-YYYY"),
      };

    case "last 30 days":
      return {
        formDate: moment().subtract(29, "days").format("DD-MMM-YYYY"),
        toDate: moment().format("DD-MMM-YYYY"),
      };

    default:
      return {
        formDate: moment(dateRange[0].$d).format("DD-MMM-YYYY"),
        toDate: moment(dateRange[1].$d).format("DD-MMM-YYYY"),
      };
  }
};
