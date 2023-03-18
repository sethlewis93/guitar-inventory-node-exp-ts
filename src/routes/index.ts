import * as express from "express";

/**
 * OIDC middleware attaches a userContext object and isAuthenticated() function to every user request.
 * The userContext object has a userinfo property that contains user information.
 * The code below passess the user profile object and passes it to the views as data.
 */
export const register = (app: express.Application) => {
    const oidc = app.locals.oidc;

    // Route handler for the home page
    app.get("/", (req: any, res) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render("index", { isAuthenticated: req.isAuthenticated(), user });
    });

    // Secure route handler for the login page redirecting to "guitars" page
    app.get("/login", oidc.ensureAuthenticated(), (req, res) => {
        res.redirect("/guitars");
    });

    // Hanlde logout
    app.get("/logout", (req: any, res) => {
        req.logout();
        res.redirect("/");
    });

    // Secure route handler for guitars page
    app.get("/guitars", oidc.ensureAuthenticated(), (req: any, res) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render("guitars", { isAuthenticated: req.isAuthenticated(), user });
    });
}