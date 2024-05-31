"use client";
import Link from 'next/link';
import {
  fetchApprovedFranchiseNumYearly,
  fetchDashboardData,
  fetchGraphData,
  fetchGraphData2,
} from "@/api/dashboardData";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale ,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   Title,
   Tooltip,
   Legend,
   ArcElement,
} from "chart.js";

interface CardStatsProps {
  title: string;
  subtitle: string;
  value: string;
  icon: string;
}

const CardStats: React.FC<CardStatsProps> = ({
  title,
  subtitle,
  value,
  icon,
}) => {
  return (
    <div className="bg-white shadow-lg flex justify-between rounded-xl px-5 py-7">
    <div className="w-full">
      <h2 className="text-5xl font-bold text-sky-700">{value}</h2>
      <h3 className="text-2xl font-semibold text-sky-700">{title}</h3>
      <h4 className="text-md text-slate-400">{subtitle}</h4>
    </div>
    <div className="self-end w-full flex justify-end">
      <Image width={100} height={100} src={icon} alt={icon} />
    </div>
  </div>
  );
};
interface LineChartProps {
  options: any; // Data type ng options mo sa line chart
  data: any; // Data type ng data mo sa line chart
}

const LineChart: React.FC<LineChartProps> = ({ options, data }) => {
  return <Line options={options} data={data} />;
};

const Overview: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [reportRecords, setReportRecords] = useState<Record<string, number>>(
    {}
  );
  const [violatorRecords, setViolatorRecords] = useState<any[]>([]);

  const [totalOverPaying, setTotalOverPaying] = useState(0);
  const [totalOverLoading, setTotalOverLoading] = useState(0);
  const [totalOverSpeeding, setTotalOverSpeeding] = useState(0);
  const [totalOverPricing, setTotalOverPricing] = useState(0);
  const [totalOthers, setTotalOthers] = useState(0);

  const memoizedFetchDashboardData = useCallback(async () => {
    try {
      const response = await fetchDashboardData();
      if (response?.error) {
        // console.error(response.error);
      } else {
        setRecords(response?.data || []);
        // console.log(response?.data);
      }
    } catch (error) {
      // console.error("An error occurred:", error);
    }
  }, []);

  useEffect(() => {
    memoizedFetchDashboardData();
    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ViewDashboardAnalytics",
        },
        (payload) => {
          if (payload.new) {
            setRecords(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memoizedFetchDashboardData]);

  const memoizedFetchGraphData = useCallback(async () => {
    try {
      const response = await fetchGraphData();
      setReportRecords(response?.totalRecords || {});
      // console.log(response?.totalRecords);
      setTotalOverPaying(response?.totalOverPaying || 0);
      setTotalOverLoading(response?.totalOverLoading || 0);
      setTotalOverSpeeding(response?.totalOverSpeeding || 0);
      setTotalOverPricing(response?.totalOverPricing || 0);
      setTotalOthers(response?.totalOverPricing || 0);
      // console.log(response?.totalOverPaying);
      // console.log(response?.totalOverLoading);
      // console.log(response?.totalOverSpeeding);
      // console.log(response?.totalOverPricing);
    } catch (error) {
      // console.error("An error occurred:", error);
    }
  }, []);

  useEffect(() => {
    memoizedFetchGraphData();
    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ViewTricycleDriverViolationsAdmin",
        },
        (payload) => {
          if (payload.new) {
            setReportRecords(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memoizedFetchDashboardData]);

  // violators data
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().slice(0, 7)
  );
  // const [filterDate, setFilterDate] = useState("");

  const memoizedFetchGraphData2 = useCallback(async () => {
    try {
      const response = await fetchGraphData2(filterDate);
      setViolatorRecords(response?.data || []);
      // console.log(response?.data);
    } catch (error) {
      // console.error("An error occurred:", error);
    }
  }, [filterDate]);

  useEffect(() => {
    memoizedFetchGraphData2();
    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ViewTricycleDriverViolationsAdmin",
        },
        (payload) => {
          if (payload.new) {
            setViolatorRecords(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memoizedFetchGraphData2, filterDate]);

  // Applications
  const [filterYearApplications, setFilterYearApplications] = useState(
    new Date().getFullYear()
  );

  const [approvedFranchiseNum, setApprovedFranchiseNum] = useState<any[]>([]);

  const memoizedFetchApprovedFranchiseNumYearly = useCallback(async () => {
    try {
      const response = await fetchApprovedFranchiseNumYearly(
        filterYearApplications
      );
      setApprovedFranchiseNum(response || []);
    } catch (error) {
      // console.error("An error occurred:", error);
    }
  }, [filterYearApplications]);

  useEffect(() => {
    memoizedFetchApprovedFranchiseNumYearly();
    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ViewApprovedFranchiseNumYearly",
        },
        (payload) => {
          if (payload.new) {
            setApprovedFranchiseNum(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memoizedFetchApprovedFranchiseNumYearly, filterYearApplications]);

  ChartJS.register(
    CategoryScale ,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   Title,
   Tooltip,
   Legend,
   ArcElement,
  );

  const optionsTotalRecords = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        // display: false,
        position: "top" as const,
      },
      // title: {
      //   display: true,
      //   // position: "top" as const,
      //   text: "Monthly Violations Trend",
      // },
    },
  };

  const dataTotalRecords = {
    labels: Object.keys(reportRecords),
    datasets: [
      {
        label: "Number of records",
        data: Object.values(reportRecords),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        // borderColor: "rgba(75, 192, 192, 1)",
        // borderWidth: 1,
      },
    ],
  };

  // from doughnut to line
  const optionsLine = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        // labels: {
        //   font: {
        //     size: 10,
        //   },
        // },
      },
      // title: {
      //   display: true,
      //   text: "Most Reported Violations",
      // },
    },
  };

  const dataLine = {
    labels: [
      `Over Paying - ${totalOverPaying}%`,
      `Over Loading - ${totalOverLoading}%`,
      `Over Speeding - ${totalOverSpeeding}%`,
      `Over Pricing - ${totalOverPricing}%`,
      `Others - ${totalOthers}%`,
    ],
    datasets: [
      {
        label: "Number of records",
        data: [
                  totalOverPaying,
                  totalOverLoading,
                  totalOverSpeeding,
                  totalOverPricing,
                  totalOthers,
                ],
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)", // Line color
        borderWidth: 1,
        pointBackgroundColor: "rgba(255, 99, 132)", 
      },
    ],
  }; 

  // const dataDoughnut = {
  //   labels: [
  //     `Over Paying - ${totalOverPaying}%`,
  //     `Over Loading - ${totalOverLoading}%`,
  //     `Over Speeding - ${totalOverSpeeding}%`,
  //     `Over Pricing - ${totalOverPricing}%`,
  //   ],
  //   datasets: [
  //     {
  //       data: [
  //         totalOverPaying,
  //         totalOverLoading,
  //         totalOverSpeeding,
  //         totalOverPricing,
  //       ],
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.2)",
  //         "rgba(54, 162, 235, 0.2)",
  //         "rgba(255, 206, 86, 0.2)",
  //         "rgba(75, 192, 192, 0.2)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //         "rgba(75, 192, 192, 1)",
  //       ],
  //     },
  //   ],
  // };

  // violators graphs
  const optionsViolatorRecords = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        // display: false,
        position: "top" as const,
      },
      // title: {
      //   display: true,
      //   text: "Highly Reported Per Month",
      // },
    },
  };

  const dataViolatorRecords = {
    labels: violatorRecords.map((record) => record.driver_name),
    datasets: [
      {
        label: "Number of records",
        data: violatorRecords.map((record) => record.num_of_violations),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  // Applications Date Initialization
  const optionsApprovedFranchiseNum = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  // Prepare data for the chart
  const dataApprovedFranchiseNum = {
    labels: approvedFranchiseNum.map((item) => item.month),
    datasets: [
      {
        label: "Records",
        data: approvedFranchiseNum.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  const isDisabled = window.location.pathname === '/personnel/dashboard/dashboard'; // Check if the current path matches "personnel/dashboard/approval"

  return (
    <div className="flex flex-col gap-5">
      {/* <h1 className="mb-10 font-bold text-3xl">Dashboard</h1> */}
      <div className="grid md:grid-cols-3 gap-5">
      <Link href="/admin/dashboard/operators">
        <CardStats
          title="Tricycle"
          subtitle="Total Registered"
          value={records[0]?.total_vehicles || "0"}
          icon="/overview-icons/tricycle.png"
        />
      </Link>
   <Link href="../dashboard/operators">
        <a>
          <CardStats
            title="Operators"
            subtitle="Total Registered"
            value={records[0]?.total_operators || "0"}
            icon="/overview-icons/operator.png"
          />
        </a>
      </Link>
      <Link href="../dashboard/drivers">
        <CardStats
          title="Drivers"
          subtitle="Total Registered"
          value={records[0]?.total_drivers || "0"}
          icon="/overview-icons/driver.png"
        />
      </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-5">
      {isDisabled ? (
  <div>
    <CardStats
      title="Application"
      subtitle="Total Application"
      value={records[0]?.total_applications || "0"}
      icon="/overview-icons/approved-application.png"
    />
  </div>
) : (
  <Link href="../dashboard/approval">
    <CardStats
      title="Application"
      subtitle="Total Application"
      value={records[0]?.total_applications || "0"}
      icon="/overview-icons/approved-application.png"
    />
  </Link>
)}
          <Link href="../dashboard/tricycle-driver">
        <CardStats
          title="Reports"
          subtitle="Total Violations"
          value={records[0]?.total_reports || "0"}
          icon="/overview-icons/seo-report.png"
        />
          </Link>
        {/* <CardStats
          title="Collection"
          subtitle="Total Collection"
          value={Number(records[0]?.total_payments || "0").toLocaleString()}
          icon="/overview-icons/data-collection.png"
        /> */}
      
        {isDisabled ? (
  <div>
   <CardStats
          title="Approved"
          subtitle="Total Approved"
          value={records[0]?.total_approved_applications || "0"}
          icon="/overview-icons/approved-application.png"
        />
  </div>
) : (
  <Link href="../dashboard/approval">
  <CardStats
          title="Approved"
          subtitle="Total Approved"
          value={records[0]?.total_approved_applications || "0"}
          icon="/overview-icons/approved-application.png"
        />
  </Link>
)}
      </div>
      <div className="w-full h-60 flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-5">
  <div className="h-full w-full sm:w-[50%] bg-white shadow-lg flex flex-col justify-between rounded-xl px-5 pt-4 pb-10">
    <h1 className="text-md text-sky-700 font-medium">
      Monthly Violations Trend
          </h1>
          <Bar options={optionsTotalRecords} data={dataTotalRecords} />
        </div>
        <div className="h-full w-full sm:w-[50%] bg-white shadow-lg flex flex-col justify-between rounded-xl px-5 pt-4 pb-10">
          <h1 className="text-md text-sky-700 font-medium">
            Most Reported Complaints
          </h1>
          <Line options ={optionsLine} data={dataLine} />
        </div>
      </div>
      <div className="w-full h-60 flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-5">
        <div className="h-full w-full sm:w-[50%] bg-white shadow-lg flex flex-col justify-between rounded-xl px-5 pt-4 pb-10">
          <div className="flex justify-between">
            <h1 className="text-md text-sky-700 font-medium">
             Monthly Reported Drivers Per Month
            </h1>
            <div className="flex gap-3">
              <label
                className="text-md text-sky-700 font-medium"
                htmlFor="monthYear">
                Select Month/Year
              </label>
              <input
                type="month"
                id="monthYear"
                name="monthYear"
                className="font-semibold border-b"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
          <Bar options={optionsViolatorRecords} data={dataViolatorRecords} />
        </div>
        <div className="h-full w-full sm:w-[50%] bg-white shadow-lg flex flex-col rounded-xl px-5 pt-4 pb-10">
          <h1 className="text-md text-sky-700 font-medium">
          Most Reported Drivers/ Tricycle Driver&apos;s Violation
          </h1>
          <table className="h-full w-full text-sm text-center mt-3">
            <thead className="text-xs uppercase font-normal">
              <tr className="whitespace-nowrap border-b">
                <th>Body No.</th>
                <th>Driver</th>
                <th>No. of Reported Violations</th>
                <th>Franchise Status</th>
              </tr>
            </thead>
            <tbody>
              {violatorRecords.map((record, index) => (
                <tr key={index} className="border-b">
                  <th>{record.body_num}</th>
                  <td>{record.driver_name}</td>
                  <th>{record.num_of_violations}</th>
                  <td
                    className={
                      record.franchise_status === "active"
                        ? "text-red-700"
                        : "text-green-700"
                    }>
                    {record.franchise_status.charAt(0).toUpperCase() +
                      record.franchise_status.slice(1)}
                  </td>
                </tr>
              ))}
              {Array(5 - violatorRecords.length)
                .fill(null)
                .map((_, index) => (
                  <tr key={violatorRecords.length + index} className="border-b">
                    <th>&nbsp;</th>
                    <td>&nbsp;</td>
                    <th>&nbsp;</th>
                    <td>&nbsp;</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full h-60 flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-5">
        <div className="h-full w-full bg-white shadow-lg flex flex-col rounded-xl px-5 pt-4 pb-10">
          <div className="flex justify-between">
            <h1 className="text-md text-sky-700 font-medium">
              Number of Approved Applications per Month
            </h1>
            <div className="flex gap-3">
              <label
                className="text-md text-sky-700 font-medium"
                htmlFor="year">
                Select Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                className="font-semibold border-b"
                value={filterYearApplications}
                onChange={(e) =>
                  setFilterYearApplications(Number(e.target.value))
                }
                min="1900"
                max="2099"
                step="1"
                maxLength={4}
              />
            </div>
          </div>
          <Bar
            options={optionsApprovedFranchiseNum}
            data={dataApprovedFranchiseNum}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
