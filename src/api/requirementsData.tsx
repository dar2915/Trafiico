import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchRequirementDocumentDataByID = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("ViewRequirementDocsWithYear")
      .select("*")
      .eq("application_id", id);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching data1111:", error);
    return { data: null, error };
  }
};

export const insertRequirementDocumentData = async (data: any) => {
  try {
    const response = await supabase
      .from("RequirementDocuments")
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
