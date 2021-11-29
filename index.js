import express from 'express'
import pool from './db.js'

const app = express()

app.use(express.json())


//Routes

//get all todos
app.get('/todos', async (req,res) =>{
    try{
        const allTodos = await pool.query('select * from todo');
        res.json(allTodos.rows);
    } catch (e) {
        console.error(e.message)
    }
})


//get a todo
app.get('/todos/:id', async (req,res) =>{
    const {id} = req.params;
    try{
        const todo = await pool.query('select * from todo where todo_id=($1)',[id])
        res.json(todo.rows[0])
    } catch (e){
        console.error(e.message)
    }
})


//create a todo

app.post('/todos',async (req,res) => {
    try{
        // console.log(req.body)
        // res.json({status : 'success'})
        const { description } =req.body;
        const newTodo = await pool.query('INSERT INTO todo (description) VALUES ($1) returning *',[description]) 
        res.json(newTodo.rows[0])
    } catch (e) {
        console.error(e.message)
    }
})

//update a todo
app.put('/todos/:id', async (req,res) =>{
    try{
        const {id} = req.params //where
        const {description} = req.body //set

        const updateTodo = await pool.query('UPDATE todo SET description=($1) WHERE todo_id = $2',[description,id])

        res.json('Todo was updated!')
    } catch(e) {
        console.error(e.message)
    }
})

//delete a todo
app.delete('/todos/:id', async (req,res) =>{
    try{
        const {id} = req.params
        const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1',[id])
        res.json({success:'Todo was deleted'}) 
    } catch(e){
        console.error(e.message)
    }
})

app.listen(5000,() => {
    console.log('listening on port 5000')
})
