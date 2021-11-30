const express = require('express');
const { v4: uuidV4 } = require('uuid');

const customers = require('./mocks/customers');

const app = express();

app.use(express.json());

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return response.status(400).json({ error: 'Customer not found' });
  }

  request.customer = customer;
  return next();
}


app.post('/account', (request, response) => {
  const { name, cpf } = request.body;

  const custumerAlreadyExists = customers.some((customer) => customer.cpf === cpf);
  if (custumerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists' });
  }

  customers.push({
    name,
    cpf,
    id: uuidV4(),
    statement: []
  });

  return response.sendStatus(201);
});

app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.listen(3000);