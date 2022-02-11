import postgres from '../src/index.js';

import { databaseURL } from '../config.js';

const sql = postgres(databaseURL, {
    max: 1
});
main().catch(err => console.log(err)).then(() => process.exit());
async function main() {
    // await one query to establish a connection
    await sql `select 1 as b`

    const startConcurrent = Date.now();
    await Promise.all([
        sql`begin`,
        sql`select 1 as a`,
        sql`select * from notexistingtable`,
    ]).catch(err=>{
        console.log('found an error', err.message);
    });
    console.log(await sql`commit`)
    console.log(await sql`commit`)
    await sql`select 1 as b;`;
    console.log('concurrent done ', Date.now() - startConcurrent);
    console.log(JSON.stringify(results2))
}