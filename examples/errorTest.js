import postgres from '../lib/index';
import { databaseURL } from '../config.js';

const sql = postgres(databaseURL, {
    max: 1
});
main().catch(err => console.log(err)).then(() => process.exit());
async function main() {
    // await one query to establish a connection
    await sql `select 1 as b`

    // concurrent transaction
    const startConcurrent = Date.now();
    Promise.all([
        sql `begin`,
        sql `select 1 as a`,
        sql `select 2 as a`,
        sql `select * from nonexistingtable`,
        sql `select 4 as a`,
        sql `select 5 as a`,
        sql `select 6 as a`,
        sql `commit;`,
    ]).catch(err => {
        console.log('yes,the error was on purpose.')
    });

    const results2 = await Promise.all([
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
    console.log(JSON.stringify(results2))
}