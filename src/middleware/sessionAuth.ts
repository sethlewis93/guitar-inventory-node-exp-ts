import { ExpressOIDC } from '@okta/oidc-middleware';
import session from "express-session";

export const register = (app: any) => {
    // Create OIDC client
    const oidc = new ExpressOIDC({
        client_id: process.env.OKTA_OAUTH2_CLIENT_ID,
        client_secret: process.env.OKTA_OAUTH2_CLIENT_SECRET,
        issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
        redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
        appBaseUrl: `${process.env.HOST_URL}`,
        scope: "openid profile"
    });

    // Configure Experss to use authentication sessions
    app.use(session({
        resave: true,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    }));

    // Configure Express to use the OIDC client router
    app.use(oidc.router);

    // Add the oIDC clietn to the app.locals
    app.locals.oidc = oidc;
}