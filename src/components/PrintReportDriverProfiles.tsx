import { fetchDriverProfiles } from "@/api/printData";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const PrintReportDriverProfiles = React.forwardRef<HTMLDivElement, {}>(
  (props, ref) => {
    const [data, setData] = useState<any[] | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchDriverProfiles();
        setData(data || []);
      };

      fetchData();
    }, []);

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();

    return (
      <div ref={ref} className="m-3">
        <div className="flex flex-col w-full border border-gray-700 bg-white">
          {/* height-custom */}
          <div className="w-full flex items-center justify-center">
            <div className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap w-full text-center text-lg font-bold border-black">
              TRICYCLE DRIVER PROFILES
            </div>
            <div className="flex gap-3 w-full items-center justify-center py-2 border-l border-black">
              <div className="flex justify-center">
                <Image
                  src={"/bunawan-logo.png"}
                  alt="Logo"
                  width={100}
                  height={50}
                />
              </div>

              <div className="flex flex-col text-sm">
                <span>Republic of the Philippines</span>
                <span>Province of Agusan del Sur</span>
                <span>MUNICIPAL OF SAN FRANCISCO </span>
                <span>San, Francisco, Agusan del Sur</span>
              </div>
            </div>
          </div>
          <table className="w-full text-sm text-center">
            <thead>
              <tr>
                <th
                  colSpan={8}
                  key={"col3"}
                  scope="col"
                  className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap border-t border-b border-black">
                  <p>
                    As of January 1 - {currentMonth} {currentDay}, {currentYear}
                  </p>
                </th>
              </tr>
              <tr>
                {[
                  "No.",
                  "NAME",
                  "ADDRESS",
                  "BIRTHDATE",
                  "CIVIL STATUS",
                  "CONTACT NO.",
                  "LICENSE NO.",
                ].map((header, index) => (
                  <th
                    key={`col${index + 4}`}
                    scope="col"
                    className={`px-3 py-2 sm:px-4 sm:py-3 border-b ${
                      index !== 0 ? "border-l" : ""
                    } border-black`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  // className={
                  //   index !== data.length - 1 ? "border-b border-black" : ""
                  // }>
                  className="border-b border-black">
                  <td className="table-td-unique">{index + 1}</td>
                  <td className="table-td">
                    {item.last_name}, {item.first_name}
                  </td>
                  <td className="table-td">{item.address}</td>
                  <td className="table-td">{item.birth_date}</td>
                  <td className="table-td">{item.civil_status}</td>
                  <td className="table-td">{item.contact_num}</td>
                  <td className="table-td">{item.license_num}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-10 mb-3 ml-3 flex items-start justify-start">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold">
                CECILLE P. GENTLLAN, RC, MPA1
              </h3>
              <h4> Municipal License Officer III</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintReportDriverProfiles.displayName = "PrintReportDriverProfiles";

export default PrintReportDriverProfiles;
