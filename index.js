const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const newId = Math.floor(Math.random() * 10000);
  return String(newId);
};

app.post("/api/persons", (req, res) => {
  const name = req.body.name;
  const number = req.body.number;
  const isNameExists = persons.some(
    (entry) => entry.name.toLowerCase() === name.toLowerCase()
  );
  if (!name || !number) {
    return res.status(400).json({
      error: "Content missing",
    });
  } else if (isNameExists) {
    return res.status(422).json({
      error: "name must be unique",
    });
  } else {
    const person = {
      name: name,
      number: number,
      id: generateId(),
    };

    persons = persons.concat(person);
    res.json(person);
  }
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const count = persons.length;
  const message = `<div><br/><p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p></div>`;
  res.send(message);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const index = persons.findIndex((person) => person.id === id);

  if (index !== -1) {
    persons.splice(index, 1);
    res.status(200).json({ message: "person deleted successfully." });
  } else {
    res.status(404).json({ message: "person not found" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT} `);
});
