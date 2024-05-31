import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchDashboardData = async () => {
  try {
    const query = supabaseAdmin.from("ViewDashboardAnalytics").select();

    const response = await query;

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchGraphData = async () => {
  const query = supabaseAdmin
    .from("ViewTricycleDriverViolationsAdmin")
    .select();

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  const totalRecords: { [key: string]: number } = {};
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();

  response.data.forEach((record) => {
    const recordDate = new Date(record.date);
    if (recordDate.getFullYear() === currentYear) {
      const month = monthNames[recordDate.getMonth()];
      if (!totalRecords[month]) {
        totalRecords[month] = 0;
      }
      totalRecords[month]++;
    }
  });

  //   const filteredData = response.data.filter(
  //     (record) => new Date(record.created_at).getFullYear() === currentYear
  //   );

  const totalOverPaying: number = response.data.filter(
    (item) => item.complain === "Over-Paying"
  ).length;

  const totalOverLoading: number = response.data.filter(
    (item) => item.complain === "Over-Loading"
  ).length;

  const totalOverSpeeding: number = response.data.filter(
    (item) => item.complain === "Over-Speeding"
  ).length;

  const totalOverPricing: number = response.data.filter(
    (item) => item.complain === "Over-Pricing"
  ).length;

  return {
    totalRecords,
    totalOverPaying,
    totalOverLoading,
    totalOverSpeeding,
    totalOverPricing,
  };
};

export const fetchGraphData2 = async (date: string) => {
  // console.log("date", date);
  try {
    const currentYear = new Date().getFullYear();

    let query = supabase.from("ViewViolatorsOverview").select().range(0, 5).order('num_of_violations', { ascending: false });

    if (date) {
      const year = date.slice(0, 4);
      const month = date.slice(5);
      const nextMonth = ("0" + ((parseInt(month) % 12) + 1)).slice(-2);
      const nextYear = month === "12" ? parseInt(year) + 1 : year;

      query = query
        .filter("date", "gte", `${year}-${month}-01T00:00:00Z`)
        .filter("date", "lt", `${nextYear}-${nextMonth}-01T00:00:00Z`);
    } else {
      query = query
        .filter("date", "gte", `${currentYear}-01-01T00:00:00Z`)
        .filter("date", "lt", `${currentYear + 1}-01-01T00:00:00Z`);
    }

    const response = await query;

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchApprovedFranchiseNumYearly = async (year: number) => {
  try {
    let query = supabase
      .from("ViewApprovedFranchiseNumYearly")
      .select("year, month, count");

    if (year) {
      query = query.filter("year", "eq", year);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Convert month number to month name
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const result = data.map((item) => ({
      ...item,
      month: monthNames[item.month - 1],
    }));

    return result;
  } catch (error) {
    console.error(error);
  }
};
