require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors()); // za dev; kasnije možeš ograničiti origin
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CAPACITY = Number(process.env.CAPACITY_PER_SLOT || 30);

// Helper: generiraj slotove 17:00–23:00 svakih 30min
function generateSlots() {
  const slots = [];
  for (let h = 17; h <= 23; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h !== 23) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
const ALL_SLOTS = generateSlots();

function timeToMinutes(t) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

function roundUpToNextHalfHour(minutes) {
  return Math.ceil(minutes / 30) * 30;
}


// 1) GET available times
// /availability?date=2026-02-18&people=4
app.get("/availability", async (req, res) => {
  try {
    const { date, people } = req.query;
    const ppl = Number(people);

    if (!date || !people || !Number.isFinite(ppl) || ppl < 1) {
      return res.status(400).json({ error: "date i people su obavezni" });
    }

    // Zbroji ljude po slotu za taj datum
    const { rows } = await pool.query(
      `
      SELECT to_char(res_time, 'HH24:MI') AS t, COALESCE(SUM(people), 0) AS total
      FROM reservations
      WHERE res_date = $1
      GROUP BY t
      `,
      [date]
    );

    const bookedMap = new Map(rows.map(r => [r.t, Number(r.total)]));

    const available = ALL_SLOTS.filter((t) => {
      const booked = bookedMap.get(t) || 0;
      return booked + ppl <= CAPACITY;
    });

        // --- sakrij prošla vremena ako je odabrani datum danas ---
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

    if (date === todayStr) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const cutoff = roundUpToNextHalfHour(nowMinutes); // npr. 20:10 -> 20:30

      const availableFiltered = available.filter(t => timeToMinutes(t) >= cutoff);
      return res.json({ date, people: ppl, capacity: CAPACITY, available: availableFiltered });
    }
    // ako nije danas
    res.json({ date, people: ppl, capacity: CAPACITY, available });

    res.json({ date, people: ppl, capacity: CAPACITY, available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2) POST reservation
app.post("/reservations", async (req, res) => {
  try {
    const { firstName, lastName, email, people, date, time } = req.body;

    const ppl = Number(people);
    if (!firstName || !lastName || !email || !date || !time || !Number.isFinite(ppl)) {
      return res.status(400).json({ error: "Nedostaju polja" });
    }

    // 2a) Provjeri kapacitet za taj slot (transaction-safe)
    // Najjednostavnije (za start): SERIALIZABLE transakcija
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");

      const sumRes = await client.query(
        `SELECT COALESCE(SUM(people), 0) AS total
         FROM reservations
         WHERE res_date = $1 AND res_time = $2::time`,
        [date, time]
      );

      const total = Number(sumRes.rows[0].total);
      if (total + ppl > CAPACITY) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          error: "Nema mjesta u tom terminu",
          totalBooked: total,
          capacity: CAPACITY,
        });
      }

      // 2b) Insert
      const ins = await client.query(
        `INSERT INTO reservations (first_name, last_name, email, people, res_date, res_time)
         VALUES ($1,$2,$3,$4,$5,$6::time)
         RETURNING id, created_at`,
        [firstName, lastName, email, ppl, date, time]
      );

      await client.query("COMMIT");
      return res.status(201).json({
        ok: true,
        reservationId: ins.rows[0].id,
        createdAt: ins.rows[0].created_at,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      // SERIALIZABLE može baciti conflict -> probaj ponovno (za sad samo javimo)
      console.error(e);
      return res.status(500).json({ error: "Neuspjelo spremanje" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: r.rows[0].ok === 1 });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`API running on http://localhost:${process.env.PORT || 3001}`);
});
