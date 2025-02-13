const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use(cors());
const Person = require("./models/person");
const PORT = process.env.PORT || 3001;

morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// const generateId = () => {
//   const newId = Math.floor(Math.random() * 10000);
//   return String(newId);
// };

// app.post("/api/persons", (req, res) => {
//   const name = req.body.name;
//   const number = req.body.number;
//   const isNameExists = persons.some(
//     (entry) => entry.name.toLowerCase() === name.toLowerCase()
//   );
//   if (!name || !number) {
//     return res.status(400).json({
//       error: "Content missing",
//     });
//   } else if (isNameExists) {
//     return res.status(422).json({
//       error: "name must be unique",
//     });
//   } else {
//     const person = {
//       name: name,
//       number: number,
//       id: generateId(),
//     };

//     persons = persons.concat(person);
//     res.json(person);
//   }
// });

// app.get("/api/persons", (req, res) => {
//   res.json(persons);
// });

// app.get("/api/persons/:id", (req, res) => {
//   const id = req.params.id;
//   const person = persons.find((person) => person.id === id);
//   if (person) {
//     res.json(person);
//   } else {
//     res.status(404).end();
//   }
// });

// app.get("/info", (req, res) => {
//   const count = persons.length;
//   const message = `<div><br/><p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p></div>`;
//   res.send(message);
// });

// app.delete("/api/persons/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const deletedPerson = persons.filter((person) => person.id === id);
//   res.send(deletedPerson)

// });

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        res.json(persons);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const name = req.body.name;
  const number = req.body.number;

  if (name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  let person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const number = req.body.number;
  Person.findByIdAndUpdate(
    id,
    { name: name, number: number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById({ _id: req.params.id })
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    const message = `<div><br/><p> Phonebook has info for ${count} people</p><p>${new Date().toString()}</p></div>`;
    res.send(message);
  });
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT} `);
});
