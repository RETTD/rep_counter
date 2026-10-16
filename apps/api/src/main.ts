import "reflect-metadata";

import { createApi } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const api = await createApi("data/rep-counter.sqlite");

await api.application.listen(port);
