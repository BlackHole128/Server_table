const express = require("express");
const mysql = require("mysql2");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//  MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change if needed
  password: "Sbl@2025", // Change if needed
  database: "server_management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log(" Connected to MySQL");
  }
});

//  Fetch Servers
app.get("/api/servers", (req, res) => {
  db.query(
    `SELECT s.id AS serviceId, s.service_name, d.* 
     FROM servers s 
     LEFT JOIN server_details d ON s.id = d.server_id`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      
      const formattedData = [];
      results.forEach((row) => {
        let service = formattedData.find((s) => s.serviceId === row.serviceId);
        if (!service) {
          service = {
            serviceId: row.serviceId,
            serviceName: row.service_name,
            production: [],
            devUAT: [],
          };
          formattedData.push(service);
        }
        
        if (row.environment === "production") {
          service.production.push({
            id: row.id,
            purpose: row.purpose,
            cpu: row.cpu,
            memory: row.memory,
            hdd: row.hdd,
            status: row.status,
          });
        } else if (row.environment === "devUAT") {
          service.devUAT.push({
            id: row.id,
            purpose: row.purpose,
            cpu: row.cpu,
            memory: row.memory,
            hdd: row.hdd,
            status: row.status,
          });
        }
      });

      res.json(formattedData);
    }
  );
});

//  Update Data
app.post("/api/update", (req, res) => {
  const updatedData = req.body;
  updatedData.forEach((service) => {
    service.production.forEach((row) => {
      db.query(
        "UPDATE server_details SET cpu=?, memory=?, hdd=?, status=? WHERE id=?",
        [row.cpu, row.memory, row.hdd, row.status, row.id]
      );
    });

    service.devUAT.forEach((row) => {
      db.query(
        "UPDATE server_details SET cpu=?, memory=?, hdd=?, status=? WHERE id=?",
        [row.cpu, row.memory, row.hdd, row.status, row.id]
      );
    });
  });

  res.json({ message: "Data Updated Successfully" });
});

// Add New Service
app.post("/api/addService", (req, res) => {
  const { serviceName } = req.body;
  
  db.query(
    "INSERT INTO servers (service_name) VALUES (?)",
    [serviceName],
    (err, result) => {
      if (err) return res.status(500).send(err);
      const newServiceId = result.insertId;
      
      ["production", "devUAT"].forEach((env) => {
        ["Database", "Application", "Others"].forEach((purpose) => {
          db.query(
            "INSERT INTO server_details (server_id, environment, purpose, cpu, memory, hdd, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [newServiceId, env, purpose, "", "", "", ""]
          );
        });
      });

      res.json({ message: "New Service Added", serviceId: newServiceId });
    }
  );
});

app.listen(5000, () => console.log(" Server running on port 5000"));
