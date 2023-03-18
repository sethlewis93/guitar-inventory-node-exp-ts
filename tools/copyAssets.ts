import * as shell from "shelljs";

// Copy all view templates
shell.cp("-R", "src/views", "dist/");