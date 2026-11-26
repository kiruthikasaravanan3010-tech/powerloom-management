import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";

function WeeklyReport() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState(null);

  useEffect(() => {
    fetchWeeklyProduction();
  }, []);

  const fetchWeeklyProduction = async () => {
    try {
      const response = await fetch(
        "https://powerloom-management.onrender.com/api/production"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch production data");
      }

      const data = await response.json();

      setProductions(data);
    } catch (error) {
      console.error("Weekly report error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GET MONDAY OF CURRENT WEEK
  // =====================================

  const getMonday = () => {
    const today = new Date();

    const day = today.getDay();

    const difference = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);

    monday.setDate(today.getDate() + difference);
    monday.setHours(0, 0, 0, 0);

    return monday;
  };

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const monday = getMonday();

  // =====================================
  // CREATE MONDAY TO SUNDAY
  // =====================================

  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);

    date.setDate(
      monday.getDate() + i
    );

    weekDays.push(date);
  }

  // =====================================
  // CURRENT WEEK RECORDS
  // =====================================

  const weeklyRecords = productions.filter(
    (item) => {
      if (!item.date) {
        return false;
      }

      const productionDate = new Date(
        item.date
      );

      productionDate.setHours(
        0,
        0,
        0,
        0
      );

      const sunday = new Date(
        monday
      );

      sunday.setDate(
        monday.getDate() + 6
      );

      sunday.setHours(
        23,
        59,
        59,
        999
      );

      return (
        productionDate >= monday &&
        productionDate <= sunday
      );
    }
  );

  // =====================================
  // TOTAL WEEKLY PRODUCTION
  // =====================================

  const weeklyProduction =
    weeklyRecords.reduce(
      (total, item) =>
        total +
        Number(
          item.productionQuantity || 0
        ),
      0
    );

  // =====================================
  // DAILY PRODUCTION
  // =====================================

  const dailyData = weekDays.map(
    (date) => {
      const dateKey =
        getDateKey(date);

      const dayRecords =
        weeklyRecords.filter(
          (item) => {
            if (!item.date) {
              return false;
            }

            const productionDate =
              new Date(item.date);

            return (
              getDateKey(
                productionDate
              ) === dateKey
            );
          }
        );

      const production =
        dayRecords.reduce(
          (total, item) =>
            total +
            Number(
              item.productionQuantity ||
                0
            ),
          0
        );

      const machines = new Set(
        dayRecords
          .map(
            (item) =>
              item.machineNumber
          )
          .filter(Boolean)
      );

      const operators = new Set(
        dayRecords
          .map(
            (item) =>
              item.operatorName
          )
          .filter(Boolean)
      );

      return {
        date,
        day: date.toLocaleDateString(
          "en-US",
          {
            weekday: "long"
          }
        ),
        production,
        machines: machines.size,
        operators: operators.size
      };
    }
  );

  // =====================================
  // ACTIVE DAYS
  // =====================================

  const activeDays =
    dailyData.filter(
      (day) =>
        day.production > 0
    );

  // =====================================
  // AVERAGE DAILY PRODUCTION
  // =====================================

  const averageDaily =
    activeDays.length > 0
      ? Math.round(
          weeklyProduction /
            activeDays.length
        )
      : 0;

  // =====================================
  // BEST PRODUCTION DAY
  // =====================================

  const bestDay =
    dailyData.length > 0
      ? dailyData.reduce(
          (best, current) =>
            current.production >
            best.production
              ? current
              : best,
          dailyData[0]
        )
      : null;

  // =====================================
  // MACHINES USED
  // =====================================

  const machinesUsed =
    new Set(
      weeklyRecords
        .map(
          (item) =>
            item.machineNumber
        )
        .filter(Boolean)
    ).size;

  // =====================================
  // OPERATOR WEEKLY PERFORMANCE
  // =====================================

  const operatorMap = {};

  weeklyRecords.forEach((item) => {
    const operator =
      item.operatorName?.trim();

    const machine =
      item.machineNumber?.trim();

    if (!operator) {
      return;
    }

    const key = `${operator}-${machine}`;

    if (!operatorMap[key]) {
      operatorMap[key] = {
        operatorName: operator,
        machineNumber:
          machine || "Not assigned",
        production: 0
      };
    }

    operatorMap[key].production +=
      Number(
        item.productionQuantity || 0
      );
  });

  const operatorPerformance =
    Object.values(operatorMap).sort(
      (a, b) =>
        b.production -
        a.production
    );

  // =====================================
  // OPERATOR DETAILS
  // =====================================

  const getOperatorDetails = (
    operatorName,
    machineNumber
  ) => {
    const records =
      weeklyRecords.filter(
        (item) =>
          item.operatorName?.trim() ===
            operatorName &&
          (item.machineNumber?.trim() ||
            "Not assigned") ===
            machineNumber
      );

    return weekDays.map(
      (date) => {
        const dateKey =
          getDateKey(date);

        const dayRecords =
          records.filter(
            (item) => {
              if (!item.date) {
                return false;
              }

              return (
                getDateKey(
                  new Date(
                    item.date
                  )
                ) === dateKey
              );
            }
          );

        const production =
          dayRecords.reduce(
            (total, item) =>
              total +
              Number(
                item.productionQuantity ||
                  0
              ),
            0
          );

        return {
          date,
          day: date.toLocaleDateString(
            "en-US",
            {
              weekday: "long"
            }
          ),
          production
        };
      }
    );
  };

  // =====================================
  // DOWNLOAD WEEKLY REPORT
  // =====================================

  const handleDownloadReport = () => {
    const reportData = [
      ["KIRUTHIKA TEXTILES"],
      ["Weekly Production Report"],
      [""],
      [
        "Period",
        `${getDateKey(
          monday
        )} to ${getDateKey(
          weekDays[6]
        )}`
      ],
      [""],
      [
        "Day",
        "Production (Pieces)",
        "Machines",
        "Operators"
      ]
    ];

    // Daily production
    dailyData.forEach((day) => {
      reportData.push([
        day.day,
        day.production,
        day.machines,
        day.operators
      ]);
    });

    // Summary
    reportData.push([""]);

    reportData.push([
      "Weekly Production",
      weeklyProduction,
      "",
      ""
    ]);

    reportData.push([
      "Average Daily Production",
      averageDaily,
      "",
      ""
    ]);

    reportData.push([
      "Best Production Day",
      bestDay?.production || 0,
      bestDay?.day ||
        "No production",
      ""
    ]);

    reportData.push([
      "Machines Used",
      machinesUsed,
      "",
      ""
    ]);

    // Operator performance
    reportData.push([""]);

    reportData.push([
      "Operator Weekly Performance"
    ]);

    reportData.push([
      "Operator",
      "Machine",
      "Production (Pieces)"
    ]);

    operatorPerformance.forEach(
      (operator) => {
        reportData.push([
          operator.operatorName,
          operator.machineNumber,
          operator.production
        ]);
      }
    );

    const csvContent =
      reportData
        .map((row) =>
          row
            .map((value) =>
              `"${String(
                value
              ).replace(
                /"/g,
                '""'
              )}"`
            )
            .join(",")
        )
        .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download = `Weekly_Production_Report_${getDateKey(
      monday
    )}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="page-title">

        <div>
          <h1>
            Weekly Report
          </h1>

          <p>
            Production summary for
            the current week
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={
            handleDownloadReport
          }
        >
          Download Report
        </button>

      </div>

      {loading ? (
        <div className="content-card">
          <p>
            Loading weekly report...
          </p>
        </div>
      ) : (
        <>
          {/* =====================================
              SUMMARY CARDS
          ====================================== */}

          <div className="stats-grid">

            <StatCard
              title="Weekly Production"
              value={`${weeklyProduction.toLocaleString()} pieces`}
              description="Total production"
            />

            <StatCard
              title="Average Daily"
              value={`${averageDaily.toLocaleString()} pieces`}
              description="Average production"
            />

            <StatCard
              title="Best Day"
              value={`${(
                bestDay?.production ||
                0
              ).toLocaleString()} pieces`}
              description={
                bestDay &&
                bestDay.production >
                  0
                  ? bestDay.day
                  : "No production"
              }
            />

            <StatCard
              title="Machines Used"
              value={machinesUsed}
              description="Machines used this week"
            />

          </div>

          {/* =====================================
              DAILY PRODUCTION
          ====================================== */}

          <div className="content-card">

            <h2>
              Daily Production - This Week
            </h2>

            <table className="table">

              <thead>
                <tr>
                  <th>
                    Day
                  </th>

                  <th>
                    Production (Pieces)
                  </th>

                  <th>
                    Machines
                  </th>

                  <th>
                    Operators
                  </th>
                </tr>
              </thead>

              <tbody>

                {dailyData.map(
                  (day) => (
                    <tr
                      key={getDateKey(
                        day.date
                      )}
                    >

                      <td>
                        {day.day}
                      </td>

                      <td>
                        {day.production.toLocaleString()} pieces
                      </td>

                      <td>
                        {day.machines}
                      </td>

                      <td>
                        {day.operators}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* =====================================
              OPERATOR PERFORMANCE
          ====================================== */}

          <div className="content-card">

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "15px"
              }}
            >
              <div>
                <h2>
                  Operator Weekly Performance
                </h2>

                <p>
                  Operator-wise production
                  for the current week
                </p>
              </div>
            </div>

            {operatorPerformance.length ===
            0 ? (
              <p>
                No operator production
                recorded this week.
              </p>
            ) : (
              <table className="table">

                <thead>
                  <tr>

                    <th>
                      Operator
                    </th>

                    <th>
                      Machine
                    </th>

                    <th>
                      Pieces Woven
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {operatorPerformance.map(
                    (
                      operator,
                      index
                    ) => (
                      <tr
                        key={`${operator.operatorName}-${operator.machineNumber}-${index}`}
                      >

                        <td>
                          <strong>
                            {
                              operator.operatorName
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            operator.machineNumber
                          }
                        </td>

                        <td>
                          {operator.production.toLocaleString()} pieces
                        </td>

                        <td>
                          <button
                            className="secondary-btn"
                            onClick={() =>
                              setSelectedOperator(
                                operator
                              )
                            }
                          >
                            View Details
                          </button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </div>

          {/* =====================================
              OPERATOR DETAILS
          ====================================== */}

          {selectedOperator && (
            <div className="content-card">

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "15px"
                }}
              >

                <div>
                  <h2>
                    Operator Details
                  </h2>

                  <p>
                    {
                      selectedOperator.operatorName
                    }{" "}
                    -{" "}
                    {
                      selectedOperator.machineNumber
                    }
                  </p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={() =>
                    setSelectedOperator(
                      null
                    )
                  }
                >
                  Close
                </button>

              </div>

              <table className="table">

                <thead>
                  <tr>

                    <th>
                      Day
                    </th>

                    <th>
                      Pieces Woven
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {getOperatorDetails(
                    selectedOperator.operatorName,
                    selectedOperator.machineNumber
                  ).map(
                    (day) => (
                      <tr
                        key={getDateKey(
                          day.date
                        )}
                      >

                        <td>
                          {day.day}
                        </td>

                        <td>
                          {day.production.toLocaleString()} pieces
                        </td>

                      </tr>
                    )
                  )}

                  <tr>

                    <td>
                      <strong>
                        Total
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {selectedOperator.production.toLocaleString()} pieces
                      </strong>
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>
          )}
        </>
      )}

    </div>
  );
}

export default WeeklyReport;