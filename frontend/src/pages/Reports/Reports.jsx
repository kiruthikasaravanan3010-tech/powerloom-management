import {
  CalendarDays,
  CalendarRange,
  Calendar,
  Factory,
  ArrowUpRight,
  FileBarChart
} from "lucide-react";

const reportItems = [
  {
    title: "Daily Report",
    description:
      "View daily production entries, machine output, and total production for a selected day.",
    icon: CalendarDays,
    page: "daily-report",
    color: "#2563eb",
    background: "#dbeafe",
    tag: "DAILY"
  },
  {
    title: "Weekly Report",
    description:
      "Track weekly production totals and understand production performance throughout the week.",
    icon: CalendarRange,
    page: "weekly-report",
    color: "#7c3aed",
    background: "#ede9fe",
    tag: "WEEKLY"
  },
  {
    title: "Monthly Report",
    description:
      "Review monthly production quantities and monitor overall production progress.",
    icon: Calendar,
    page: "monthly-report",
    color: "#059669",
    background: "#d1fae5",
    tag: "MONTHLY"
  },
  {
    title: "Machine Report",
    description:
      "Analyze machine-wise production details and compare the output of different machines.",
    icon: Factory,
    page: "machine-report",
    color: "#d97706",
    background: "#fef3c7",
    tag: "MACHINE"
  }
];

function Reports({ setPage }) {
  return (
    <div className="page reports-page">

      {/* PAGE HEADER */}
      <div className="page-header reports-page-header">
        <div>
          <div className="reports-heading">
            <div className="reports-heading-icon">
              <FileBarChart size={24} />
            </div>

            <div>
              <h1>Production Reports</h1>
              <p>
                Monitor production output and review performance details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT OVERVIEW */}
      <div className="reports-intro">
        <div>
          <h2>Report Overview</h2>
          <p>
            Choose a report category to view detailed production records.
          </p>
        </div>

        <span className="reports-count">
          {reportItems.length} Report Categories
        </span>
      </div>

      {/* REPORT CARDS */}
      <div className="report-cards">
        {reportItems.map((report) => {
          const Icon = report.icon;

          return (
            <button
              type="button"
              className="report-card"
              key={report.page}
              onClick={() => setPage(report.page)}
              aria-label={`Open ${report.title}`}
            >
              <div className="report-card-top">
                <div
                  className="report-icon"
                  style={{
                    color: report.color,
                    backgroundColor: report.background
                  }}
                >
                  <Icon size={25} />
                </div>

                <span className="report-tag">
                  {report.tag}
                </span>
              </div>

              <h2>{report.title}</h2>

              <p>{report.description}</p>

              <div className="report-card-footer">
                <span>View Report</span>

                <ArrowUpRight size={19} />
              </div>
            </button>
          );
        })}
      </div>

      {/* FOOTER NOTE */}
      <div className="reports-note">
        <div className="reports-note-icon">
          <FileBarChart size={20} />
        </div>

        <div>
          <strong>Production Insights</strong>
          <p>
            Use these reports to review recorded production data and
            understand machine-wise output.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Reports;