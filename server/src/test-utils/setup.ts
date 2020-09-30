import { testConnection } from "./testConnection";

console.log("setting stuff up");
testConnection(true).then(() => process.exit());
