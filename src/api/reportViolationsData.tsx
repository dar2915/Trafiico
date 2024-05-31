import { supabase, supabaseAdmin } from "@/utils/supabase";

// used by Tricycle Driver's Violation
export const fetchReportViolationsData = async (
  searchValue: string,
  startDate: string,
  endDate: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  try {
    let query = supabase
      .from("ViewTricycleDriverViolationsAdminUniqueBodyNum")
      .select(`*`, { count: "exact" })
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (searchValue) {
      query = query.or(
        `driver_name.ilike.%${searchValue}%,driver_license_num.ilike.%${searchValue}%,body_num.ilike.%${searchValue}%,complain.ilike.%${searchValue}%,action_taken.ilike.%${searchValue}%`
      );
    }

    if (startDate && endDate) {
      query = query.filter(`date`, "gte", startDate).filter(`date`, "lte", endDate);
    }

    const response = await query.range(offset, offset + entriesPerPage - 1);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchReportTricycleDriversData = async  (body_num: string) => {
  try {
    const response = await supabase
      .from("ViewTricycleDriverViolationsAdmin")
      .select(`*`, { count: "exact" })
      .eq("body_num", body_num)
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export const fetchReportTricycleDriversDataById = async  (id: string) => {
  try {
    const response = await supabase
      .from("ViewTricycleDriverViolationsAdmin")
      .select(`*`, { count: "exact" })
      .eq("id", id)
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export const fetchReportViolations = async (
  currentView: string,
  userId: string,
  role: string
) => {
  try {
    let query = supabase.from("ViewTricycleDriverViolationsAdmin").select();

    if (currentView === "personal" && role === "enforcer") {
      query = query.eq("enforcer_id", userId);
    } else if (currentView === "passenger" && role === "enforcer") {
      query = query.is("enforcer_id", null);
      // query = query.not("passenger_id", "is", null);
      query = query.or("passenger_id.not.is.null,passenger_id.is.null");

      // .or(`centre_id.eq.${state?.trim()},centre_id.is.null`)
    } else if (currentView === "passenger" && role === "passenger") {
      query = query.eq("passenger_id", userId);
    }
    // else {
    //   query = query.is("enforcer_id", null);
    //   query = query.is("passenger_id", null);
    // }

    const response = await query
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// count how many violations a driver has
// instead of using the id of the driver, the body number is used (driverId => bodyNum)
export const fetchViolatorDetails = async (bodyNum: string) => {
  try {
    const response = await supabase
      .from("ViewTricycleDriverViolationsAdmin")
      .select("body_num", { count: "exact" })
      .eq("body_num", bodyNum)
      .eq("action_taken", "pending");

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// export const fetchReportViolations = async () => {
//   try {
//     const query = supabase.from("ViewTricycleDriverViolationsAdmin").select(
//       `*,
//       Applications!inner(id, body_num, franchise_status, operator_id,
//         DriverProfiles!inner(id, last_name, first_name, middle_name, license_num),
//         OperatorProfiles!inner(id, last_name, first_name, middle_name, address,
//             VehicleOwnershipRecords!inner(id, lto_plate_num, date_registered, zone))
//     )`
//     );

//     const response = await query;

//     if (response.error) {
//       throw response.error;
//     }
//     return response;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// };

// export const fetchViolatorDetails = async () => {
//   try {
//     const currentYear = new Date().getFullYear();
//     // const currentYear = 2025;

//     const response = await supabase
//       .from("ViewTricycleDriverViolationsAdmin")
//       .select()
//       .filter("date", "gte", `${currentYear}-01-01T00:00:00Z`)
//       .filter("date", "lt", `${currentYear + 1}-01-01T00:00:00Z`);

//     if (response.error) {
//       throw response.error;
//     }
//     return response;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// };

export const insertReportViolations = async (data: any) => {
  try {
    const response = await supabase
      .from("ReportViolations")
      .insert(data)
      .select("id"); // Select the 'id' column

    if (response.error) {
      throw response.error;
    }

    // Return the ID of the newly created row
    return response.data[0].id;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

export const updateReportViolations = async (id: string, data: any) => {
  try {
    const response = await supabase
      .from("ReportViolations")
      .update(data)
      .eq("id", id);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

export const deleteReportViolations = async (id: string) => {
  try {
    const response = await supabase
      .from("ReportViolations")
      .delete()
      .eq("id", id);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    return null;
  }
};
