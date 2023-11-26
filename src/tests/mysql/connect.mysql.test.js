const mysql = require('mysql2');

// create connection to pool server
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'shopDEV',
});

const batchSize = 100000; // adjust batch size
const totalSize = 10_000_000; // adjust batch size // 1_000_000 = ::::::TIME:::: 6.147s
// 10_000_00 = ::::::TIME:::: 1:00.341 (m:ss.mmm)

let currentId = 1;
console.time('::::::TIME:::');
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `Name-${currentId}`;
    const age = currentId;
    const address = `Address=${currentId}`;

    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd('::::::TIME:::');
    pool.end((err) => {
      if (err) {
        console.log(`error occurred while running batch`);
      } else {
        console.log(`Connection pool closed successfully`);
      }
    });
    return;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async function (err, results) {
    if (err) throw err;

    console.log(`Inserted ${results.affectedRows} records`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
