const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const task = require("./models/task");
const Task = require("./models/task");

const app = express();
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./task-list.db",
});
const tasks = Task(sequelize, DataTypes);

// We need to parse JSON coming from requests
app.use(express.json());

// List tasks
app.get("/tasks", async (req, res) => {
  const db = await tasks.findAll();
  res.json(db);
});

// Create task
app.post("/tasks", async (req, res) => {
  const body = req.body;

  await tasks.create({
    description: body.description,
    done: body.done,
  });

  res.json({ resposta: "Registro Novo", data: body });
});

// Show task
app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const taskId = await tasks.findByPk(id);
  res.json(taskId);
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const taskId = await tasks.findByPk(id);
  taskId.update({
    description: body.description,
    done: body.done,
  });
  res.json({ resposta: "Registro Atualizado", data: task, atualizacao: body });
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  await tasks.destroy({ where: { id: id } });
  res.json({ resposta: "Registro Apagado", id: id });
});

app.listen(3000, () => {
  console.log("Iniciando o ExpressJS na porta 3000");
});
