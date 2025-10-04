const mongoose = require("mongoose");

const dbConnect = () => {
    const DB_URI = process.env.DB_URI;
   
    mongoose
      .connect(DB_URI)
      .catch((error) => {
        console.log(" ERROR DE CONEXION!");
      })
      .then(() => {
        console.log(" CONEXION ESTABLECIDA A MONGOO");
      });
  };


module.exports = dbConnect

