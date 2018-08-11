const Sequelize = require ('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL)
const express = require ('express')
const port = process.env.PORT || 3000
const path = require ('path')



//App
const app = express();
app.listen(port, ()=>{
    console.log(`App is listening to port ${port}`)
})






//Routes
app.use(`/dist`, express.static(path.join(__dirname, `/dist`)))

app.get('/', (req, res, next)=>{
    res.sendFile(path.join(__dirname, `index.html`))
})

app.get('/api/categories', async (req, res, next)=>{
    const allCategories = await Category.findAll({include: [Product]})
    res.send(allCategories)
})

app.get('/api/categories/:id', async (req, res, next)=>{
    const oneCatgeory = await Category.findById(req.params.id,{include: [Product]})
    res.send(oneCatgeory)
})



//Models
const Product = conn.define('product',{
    name: Sequelize.STRING,
})

const Category = conn.define('category',{
    name: Sequelize.STRING
})

Product.belongsTo(Category);
Category.hasMany(Product);


conn.sync({force: true}).then(async()=>{
    const Products = await Promise.all([
        Product.create({name: 'canned tomatoes'}),
        Product.create({name: 'beer'}),
        Product.create({name: 'soda'}),
        Product.create({name: 'ketchup'}),
    ])
    const Categories = await Promise.all([
        Category.create({name: 'beverages'}),
        Category.create({name: 'canned goods'}),
        Category.create({name: 'condiments'}),
        Category.create({name: 'paper goods'}),
    ]).then(([beverages, cannedGoods, condiments, paperGoods])=>{
        const [cannedTomatoes, beer, soda, ketchup] = Products;
        cannedTomatoes.setCategory(cannedGoods);
        beer.setCategory(beverages)
        soda.setCategory(beverages)
        ketchup.setCategory(condiments)
    })
})


module.exports = {
    conn,
    models:{
        Product,
        Category
    }
}

