import { supabase } from "@/utils/supabase";

export const fetchNotifications = async (isEnforcer?: boolean) => {
  try {
    let query = supabase
      .from("ViewTricycleDriverViolationsAdmin")
      .select(
        "complain, date, time, passenger_id, passenger_name, complainant_name, enforcer_id, enforcer_name, driver_name"
      );

    if (isEnforcer) {
      query = query.is("enforcer_id", null);
    }

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
