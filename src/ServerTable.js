import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ServerTable.css";

const ServerTable = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("serverData");
    return savedData ? JSON.parse(savedData) : [
      {
        serviceName: "New Service",
        production: [
          { purpose: "Database", cpu: " ", memory: " ", hdd: " ", status: " " },
          { purpose: "Application", cpu: "", memory: "", hdd: "", status: "" },
          { purpose: "Others", cpu: "", memory: "", hdd: "", status: "" },
        ],
        devUAT: [
          { purpose: "Database", cpu: "", memory: "", hdd: "", status: "" },
          { purpose: "Application", cpu: "", memory: "", hdd: "", status: "" },
          { purpose: "Other (FS)", cpu: "", memory: "", hdd: "", status: "" },
        ],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("serverData", JSON.stringify(data));
  }, [data]);

  const addRow = () => {
    console.log("Add Service Clicked!");
    const newRow = {
      serviceName: "New Service",
      production: [
        { purpose: "Database", cpu: "", memory: "", hdd: "", status: "" },
        { purpose: "Application", cpu: "", memory: "", hdd: "", status: "" },
        { purpose: "Others", cpu: "", memory: "", hdd: "", status: "" },
      ],
      devUAT: [
        { purpose: "Database", cpu: "", memory: "", hdd: "", status: "" },
        { purpose: "Application", cpu: "", memory: "", hdd: "", status: "" },
        { purpose: "Other (FS)", cpu: "", memory: "", hdd: "", status: "" },
      ],
    };
    setData((prevData) => [...prevData, newRow]);
  };

  const handleEdit = (serviceIndex, category, rowIndex, field, value) => {
    const newData = [...data];
    if (category === "serviceName") {
      newData[serviceIndex].serviceName = value;
    } else {
      newData[serviceIndex][category][rowIndex][field] = value;
    }
    setData(newData);
  };

  return (
    <div className="container">
      <table id="table-to-download" className="server-table">
        <thead>
          <tr>
            <th rowSpan="2">Sl.</th>
            <th rowSpan="2">Service Name</th>
            <th colSpan="5">Production Server</th>
            <th colSpan="5">Dev/UAT Server</th>
          </tr>
          <tr>
            <th>Purpose</th>
            <th>CPU (Core)</th>
            <th>Memory (GB)</th>
            <th>HDD (GB)</th>
            <th>Status</th>
            <th>Purpose</th>
            <th>CPU (Core)</th>
            <th>Memory (GB)</th>
            <th>HDD (GB)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((service, index) =>
            service.production.map((prod, prodIndex) => (
              <tr key={`${index}-${prodIndex}`}>
                {prodIndex === 0 && (
                  <td rowSpan={service.production.length}>{index + 1}</td>
                )}
                {prodIndex === 0 && (
                  <td rowSpan={service.production.length}>
                    <input
                      type="text"
                      value={service.serviceName}
                      onChange={(e) =>
                        handleEdit(index, "serviceName", 0, "serviceName", e.target.value)
                      }
                    />
                  </td>
                )}
                <td>
                   <input type="text" value={service.production[prodIndex].purpose} disabled />
                </td>
                <td>
                  <input
                    type="number"
                    value={prod.cpu}
                    onChange={(e) =>
                      handleEdit(index, "production", prodIndex, "cpu", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={prod.memory}
                    onChange={(e) =>
                      handleEdit(index, "production", prodIndex, "memory", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={prod.hdd}
                    onChange={(e) =>
                      handleEdit(index, "production", prodIndex, "hdd", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={prod.status}
                    onChange={(e) =>
                      handleEdit(index, "production", prodIndex, "status", e.target.value)
                    }
                  />
                </td>

                {/* Dev/UAT Server */}
                <td>
                  <input type="text" value={service.devUAT[prodIndex].purpose} disabled />
                </td>
                <td>
                  <input
                    type="number"
                    value={service.devUAT[prodIndex].cpu}
                    onChange={(e) =>
                      handleEdit(index, "devUAT", prodIndex, "cpu", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={service.devUAT[prodIndex].memory}
                    onChange={(e) =>
                      handleEdit(index, "devUAT", prodIndex, "memory", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={service.devUAT[prodIndex].hdd}
                    onChange={(e) =>
                      handleEdit(index, "devUAT", prodIndex, "hdd", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={service.devUAT[prodIndex].status}
                    onChange={(e) =>
                      handleEdit(index, "devUAT", prodIndex, "status", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button className="add-btn" onClick={addRow}>➕ Add Service</button>
    </div>
  );
};

export default ServerTable;
