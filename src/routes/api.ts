import * as express from "express";
import pgPromise, { ParameterizedQuery } from "pg-promise";

/**
 * Registers routes to create, read, update, and delete guitars
 */
export const register = (app: express.Application) => {
    const oidc = app.locals.oidc;
    const port = parseInt(process.env.PGPORT || "5432", 10);
    const config = {
        database: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };

    const pgp = pgPromise();
    const db = pgp(config);

    app.get(`/api/guitars/all`, oidc.ensureAuthenticated(), async (req: any, res) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const guitars = await db.any(`
                SELECT
                    id
                    , brand
                    , model
                    , year
                    , color
                FROM guitars
                WHERE user_id = $1
                ORDER BY year, brand, model`, [userId]);
            return res.json(guitars);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.json({error: error.message || error});
        }
    });

    app.post(`/api/guitars/add`, oidc.ensureAuthenticated(), async (req: any, res) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const { brand, model, year, color } = req.body;
            const addGuitar = new ParameterizedQuery({text: `
                INSERT INTO guitars(user_id, brand, model, year, color)
                VALUES($1, $2, $3, $4, $5)
                RETURNING id;
            `,
            values: [userId, brand, model, year, color]
            });
            const id = await db.one(addGuitar);
            return res.json({ id });
        } catch (error) {
           // tslint:disable-next-line:no-console
           console.error(error);
           res.json( { error: error.message || error } );
        }
    });

    app.delete(`/api/guitars/remove:id`, oidc.ensureAuthenticated(), async(req: any, res) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.result(``, [ userId, req.params.id ], (result: any) => result.rowCount);
            return res.json({ id });
        } catch (error) {
           // tslint:disable-next-line:no-console
           console.error(error);
           res.json( { error: error.message || error } );
        }
    });
};