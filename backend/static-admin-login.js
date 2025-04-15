import bcrypt from "bcrypt";
import { admin } from "./src/models/admin.model.js";
import connectToDB from "./src/config/db_connection.js";

const email = "admin@gmail.com";
const password = "admin";

async function InsertAdmin() {

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        // await admin.create({
        //     email : email,
        //     password : hashedPassword
        // });

        console.log(hashedPassword);
        
        console.log("admin added success");

    } catch (error) {
        console.log(error);
    }

}

InsertAdmin();