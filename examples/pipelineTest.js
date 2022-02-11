import postgres from '../src/index.js';
import databaseURL from '../config.js';

const sql = postgres(databaseURL, {
    max: 1
});
main().catch(err => console.log(err)).then(() => process.exit());
async function main() {
    // await one query to establish a connection
    await sql `select 1 as b`

    const startConcurrent = Date.now();
    await sql.begin(sql => [
        sql `select 1 as b`,
        sql `select 2 as b`,
        sql `select 3 as b`,
        sql `select 4 as b`,
        sql `select 5 as b`,
        sql `select 6 as b`,
    ]);
    console.log('concurrent done ', Date.now() - startConcurrent);
    console.log(JSON.stringify(results2))
}