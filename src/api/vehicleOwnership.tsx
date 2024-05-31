import { supabase } from "@/utils/supabase";

export const fetchVehicleOwnershipReportById = async (id: string) => {
  try {
    let query = supabase
      .from("VehicleOwnershipRecords")
      .select(`*`, { count: "exact" });

    if (id) {
      query = query.eq("operator_id", id);
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

export const checkVehicleBodyNumber = async (bodyNumber: string) => {
  try {
    const response = await supabase
      .from("VehicleOwnershipRecords")
      .select("*")
      .eq("body_num", bodyNumber);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const insertVehicleOwnershipReportData = async (data: any) => {
  try {
    const response = await supabase
      .from("VehicleOwnershipRecords")
      .insert(data)
      .select();

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

export const editVehicleOwnershipReportData = async (
  id: string,
  updatedRecord: any
) => {
  // console.log("id", id);
  // console.log("updatedRecord", updatedRecord);

  try {
    const { data, error } = await supabase
      .from("VehicleOwnershipRecords")
      .update(updatedRecord)
      .eq("id", id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};
