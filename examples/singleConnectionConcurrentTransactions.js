import postgres from '../lib/index';
import databaseURL from '../config.js';

const sql = postgres(databaseURL, {
    max: 1
});
main().catch(err => console.log(err)).then(() => process.exit());
async function main() {
    // await one query to establish a connection
    await sql `select 1 as b`

    const start = Date.now()
    const results = [];
    results.push(await sql `begin`);
    results.push(await sql `select 1 as a`);
    results.push(await sql `select 2 as a`);
    results.push(await sql `select 3 as a`);
    results.push(await sql `select 4 as a`);
    results.push(await sql `select 5 as a`);
    results.push(await sql `select 6 as a`);
    results.push(await sql `commit;`);
    results.push(await sql `begin;`);
    results.push(await sql `select 1 as b`);
    results.push(await sql `select 2 as b`);
    results.push(await sql `select 3 as b`);
    results.push(await sql `select 4 as b`);
    results.push(await sql `select 5 as b`);
    results.push(await sql `select 6 as b`);
    results.push(await sql `commit;`);
    console.log('sync done ', Date.now() - start);

    // concurrent transaction
    const startConcurrent = Date.now();
    const results2 = await Promise.all([
        sql `begin`,
        sql `select 1 as a`,
        sql `select 2 as a`,
        sql `select 3 as a`,
        sql `select 4 as a`,
        sql `select 5 as a`,
        sql `select 6 as a`,
        sql `commit;`,
        sql `begin;`,
        sql `select 1 as b`,
        sql `select 2 as b`,
        sql `select 3 as b`,
        sql `select 4 as b`,
        sql `select 5 as b`,
        sql `select 6 as b`,
        sql `commit;`
    ]);
    console.log('concurrent done ', Date.now() - startConcurrent);

    if (JSON.stringify(results) == JSON.stringify(results2)) {
        console.log('results are the same')
    } else {
        console.log('results are different')
    }
}