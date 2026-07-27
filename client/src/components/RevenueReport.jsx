import { useEffect, useState } from "react";
import axios from "axios";

const RevenueReport = ({ refreshTrigger }) => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchReport = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:5000/api/analytics/revenue-report"
        );

        if (isMounted) {
          setReport(res.data?.reportData || []);
        }
      } catch (err) {
        console.error("Error pulling revenue ledger accounts:", err);

        if (isMounted) {
          setReport([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div style={{ fontSize: "14px", color: "#666" }}>
        Compiling ledger balances...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        marginTop: "32px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}
    >
      <h3 style={{ margin: "0 0 4px 0", color: "#000" }}>
        Executive Revenue Ledger
      </h3>

      <p
        style={{
          color: "#666",
          fontSize: "13px",
          margin: "0 0 20px 0",
        }}
      >
        Real-time sales summaries calculated via MongoDB Pipelines
      </p>

      {report.length === 0 ? (
        <p
          style={{
            fontSize: "14px",
            color: "#999",
            fontStyle: "italic",
          }}
        >
          No transaction history found on database registers.
        </p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #eee",
                color: "#555",
              }}
            >
              <th style={{ padding: "10px 8px" }}>Movie Film Title</th>
              <th style={{ padding: "10px 8px" }}>Orders Processed</th>
              <th style={{ padding: "10px 8px" }}>Tickets Printed</th>
              <th
                style={{
                  padding: "10px 8px",
                  textAlign: "right",
                }}
              >
                Gross Sales Yield
              </th>
            </tr>
          </thead>

          <tbody>
            {report.map((row) => (
              <tr
                key={row._id}
                style={{
                  borderBottom: "1px solid #f9f9f9",
                }}
              >
                <td
                  style={{
                    padding: "12px 8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  {row._id}
                </td>

                <td
                  style={{
                    padding: "12px 8px",
                    color: "#666",
                  }}
                >
                  {row.totalTransactionsCount} logs
                </td>

                <td
                  style={{
                    padding: "12px 8px",
                    color: "#666",
                  }}
                >
                  {row.seatsReservedTotal} seats
                </td>

                <td
                  style={{
                    padding: "12px 8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#2e7d32",
                  }}
                >
                  $
                  {Number(row.totalRevenueGenerated || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RevenueReport;