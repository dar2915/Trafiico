import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchOperatorProfileData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number,
  startDate: string,
  endDate: string
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  try {
    let query = supabase
      .from("OperatorProfiles")
      .select(`*`, { count: "exact" })
      .order("date_registered", { ascending: false });

    if (searchValue) {
      query = query.or(
        `last_name.ilike.%${searchValue}%,first_name.ilike.%${searchValue}%,middle_name.ilike.%${searchValue}%,address.ilike.%${searchValue}%`
      );
    }
    if (startDate && endDate) {
      query = query.filter(`date_registered`, "gte", startDate).filter(`date_registered`, "lte", endDate);
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

export const fetchOperatorProfileByName = async (name: string) => {
  try {
    const query = supabase
      .from("OperatorProfiles")
      .select(`*`)
      .or(`last_name.ilike.%${name}%,first_name.ilike.%${name}%`)
      .order("last_name", { ascending: true });

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

export const fetchOperatorUniqueBodyNum = async (franchiseStatus: string) => {
  try {
    let query = supabase
      .from("ViewUniqueBodyNumYear")
      .select(`*`)
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true });

    if (franchiseStatus === "renewal") {
      const currentYear = new Date().getFullYear();
      const dateStr = `${currentYear}-01-01T00:00:00Z`;
      query = query
        .filter("application_date", "lt", dateStr)
        .eq("status", "approved");
    } else if (franchiseStatus === "new") {
      query = query.is("application_date", null);
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

export const fetchTotalOperatorInCurrentYear = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const dateStr = `${currentYear}-01-01T00:00:00Z`;

    const { data, error } = await supabaseAdmin
      .from("Applications")
      .select("id")
      .gte("application_date", dateStr);

    if (error) {
      throw error;
    }

    return data.length;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const insertOperatorProfileData = async (data: any) => {
  try {
    const response = await supabase
      .from("OperatorProfiles")
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

export const editOperatorProfileData = async (
  id: string,
  updatedRecord: any
) => {
  // console.log("editOperatorProfileData", id, updatedRecord)
  try {
    const { data, error } = await supabase
      .from("OperatorProfiles")
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
