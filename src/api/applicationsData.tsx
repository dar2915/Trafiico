import { supabase, supabaseAdmin } from "@/utils/supabase";

export const checkFranchiseNumber = async (franchiseNum: string) => {
  try {
    const response = await supabase
      .from("Applications")
      .select("*")
      .eq("franchise_num", franchiseNum);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchApplicationData = async (
  searchValue: string,
  startDate: string,
  endDate: string
  // filterType: string
) => {
  try {
    let query = supabase
      .from("ViewApproval")
      .select(`*`, { count: "exact" })
      .order("application_date", { ascending: false });

    if (searchValue) {
      query = query.or(
        `franchise_num.ilike.%${searchValue}%,operator_name.ilike.%${searchValue}%,driver_name.ilike.%${searchValue}%,body_num.ilike.%${searchValue}%`
      );
    }
    if (startDate && endDate) {
      query = query.filter(`application_date`, "gte", startDate).filter(`application_date`, "lte", endDate);
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

export const insertApplicationData = async (data: any) => {
  try {
    const response = await supabase.from("Applications").insert(data).select();

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

export const fetchApplicationDataForQRScanner = async (searchValue: string) => {
  if (searchValue) {
    try {
      let query = supabase
        .from("ViewApproval")
        .select(`*`, { count: "exact" })
        .order("application_date", { ascending: false })
        .eq("body_num", searchValue);

      const response = await query;

      if (response.error) {
        throw response.error;
      }
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
};

export const editApplicationData = async (
  applicationId: string,
  newStatus: string
) => {
  try {
    const { data, error } = await supabase
      .from("Applications")
      // .update([updatedRecord])
      .update({ status: newStatus })
      .eq("id", applicationId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

export const deleteApplicationData = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from("Applications")
      .delete()
      .eq("id", applicationId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};
