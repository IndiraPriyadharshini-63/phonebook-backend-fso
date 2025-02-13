const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const name = process.argv[3];
const number = process.argv[4];

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((result) => {
      console.log(`added ${name} number ${number} to phoneBook `);
    })
    .catch((err) => console.error("Error while saving the person", err));
} else {
  Person.find({})
    .then((result) => {
      console.log("phonebook:");
      result.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      );
      mongoose.connection.close();
    })
    .catch((err) => console.error("Error while fetching the person data", err));
}
