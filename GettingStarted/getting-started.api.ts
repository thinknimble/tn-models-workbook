/***
 *
 * A basic deno server that resembles our django backend
 *
 */

import { objectToSnakeCase } from "npm:@thinknimble/tn-utils@2.0.1";

const kv = await Deno.openKv();

const seed = async () => {
  const initId = crypto.randomUUID();
  const res = await kv.set(["users", initId], {
    id: initId,
    first_name: "John",
    last_name: "Doe",
    email: "jane@doe.com",
  });
  console.log(res);
  let value: any[] = [];
  const records = kv.list({ prefix: ["users"] });
  for await (const record of records) {
    value.push(record.value);
  }
  console.log(value);
};

const uuidRegex =
  /^\/api\/users\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\/?$/;

const listPagination = (results: any[]) => {
  return {
    count: 1000,
    next: null,
    previous: null,
    results,
  };
};

async function getUsers() {
  let value: any[] = [];
  const records = kv.list({ prefix: ["users"] });
  for await (const record of records) {
    value.push(record.value);
  }

  return new Response(JSON.stringify(listPagination(value ?? [])), {
    headers: { "content-type": "application/json" },
  });
}

async function getUser(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname
    .split("/")
    .filter((p) => p?.length)
    .pop();
  if (id) {
    const user = await kv.get(["users", id]);

    if (user.value) {
      return new Response(JSON.stringify(objectToSnakeCase(user.value)), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return new Response("Not Found", { status: 404 });
    }
  } else {
    return new Response("Not Found", { status: 404 });
  }
}

async function createUser(req: Request) {
  const body = await req.json();
  console.log(body);
  const id = crypto.randomUUID();
  const users = await kv.set(["users", id], { id: id, ...body });
  const user = await kv.get(["users", id]);

  return new Response(JSON.stringify(objectToSnakeCase(user.value)), {
    headers: { "content-type": "application/json" },
  });
}

async function handleUsersRoute(req: Request) {
  switch (req.method) {
    case "GET":
      if (uuidRegex.exec(new URL(req.url).pathname)) {
        return await getUser(req);
      } else {
        return await getUsers();
      }
    case "POST":
      return await createUser(req);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}

async function handler(req: Request) {
  // flushAndReset();
  const { pathname } = new URL(req.url);
  console.log(pathname);
  if (pathname.startsWith("/api/users/")) {
    return await handleUsersRoute(req);
  } else {
    return new Response("Not Found", { status: 404 });
  }
}

Deno.serve({ port: 8000 }, handler);
