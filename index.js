const express = require("express");
const morgan = require('morgan')
const cors = require('cors')
const app = express();

app.use(express.json());

morgan.token('post', req => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	} else {
		return ''
	}
})

morgan.format('postFormat', ':method :url :status :res[content-length] - :response-time ms :post')
app.use(morgan('postFormat'))
app.use(cors())

// Starting data
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Helper function
const nameExists = (name) => {
	const person = persons.filter((person) => person.name === name)[0];
	if (person) return true;
	else return false;
}

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  const currentDate = new Date().toDateString();
  const currentTime = new Date().toTimeString();
  const info = `
	<div>
		<p>Phonebook has info for ${persons.length} people</p>
	</div>
	<div>
		<p>${currentDate} ${currentTime}</p>
	`;

  res.send(info);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

	if (body.name === undefined) return res.status(400).json({ error: "name missing" })

	if (body.number === undefined) return res.status(400).json({ error: "number missing" })

	if (nameExists(body.name) === true) return res.status(400).json({ error: "name must be unique" })

  const person = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
