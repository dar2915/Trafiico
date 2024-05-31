import { supabase } from "@/utils/supabase";

export const fetchDriverComplaints = async () => {
  const query = supabase.from("ViewDriverComplaints").select();

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  return response.data;
};

export const fetchDriverProfiles = async () => {
  const query = supabase.from("DriverProfiles").select().order("last_name");

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  return response.data;
}

export const fetchRegisteredVehicles = async (selectedBarangay: string) => {
  let query = supabase.from("ViewRegisteredTricycles").select();

  if (selectedBarangay) {
    query = query.ilike("driver_address", `%${selectedBarangay}%`);
  }

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  return response.data;
};

export const fetchRenewedVehiclePermits = async (selectedBarangay: string) => {
  let query = supabase.from("ViewRenewedTricycles").select();

  if (selectedBarangay) {
    query = query.ilike("driver_address", `%${selectedBarangay}%`);
  }

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  return response.data;
};
