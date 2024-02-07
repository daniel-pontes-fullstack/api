/* 

Author: Daniel Pontes 
Website: danielpontes.online

*/
const express = require('express')
const uuid = require('uuid')

const app = express()
const port = 3000
app.use(express.json())


/*
Estrutura de Params
   
- Query params => meusite.com/users?nome=daniel&age=28        // FILTROS
- Route params => /users/2 < :id  // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
- Body params => {"name":"Daniel", "age":"28"}

- GET         => Buscar informação no back-end.
- POST        => Criar informação no back-end.
- PUT / PATCH => Alternar / Atualizar informação back-end.
- DELETE      => Deletar informação no back-end.

- Middleware  => INTERCEPTADOR - Consegue parar ou alterar uma requisição.

*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }
    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users', checkUserId, (request, response) => {
    return response.json(users)
})
app.post('/users', (request, response) => {
    const { name, age, address, phone } = request.body
        //console.log(uuid.v4())
    const user = { id: uuid.v4(), name, age, address, phone }

    users.push(user)

    return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {


    const { name, age, address, phone } = request.body
    const index = response.userIndex
    const id = request.userId

    const updatedUser = { id, name, age, address, phone }

    users[index] = updatedUser

    return response.json(updatedUser)
})


app.delete('/users/:id', checkUserId, (request, response) => {

    const { id } = request.params
    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "User not found data base" })
    }

    users.splice(index, 1)
    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`🚀🚀 Servidor iniciado na porta ${port}, acesse (http://localhost/users/)`)
})