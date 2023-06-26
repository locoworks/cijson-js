import startServer from "./functions/server";
import "./engine";

const server = startServer();

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(
    "hashed salt ---------------->",
    process.env.JWT_EXPIRY_TIME,
    process.env.BCRYPT_SALT
  );

  console.log(`Server listening at ${address}`);
});
