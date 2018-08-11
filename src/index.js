import React, {Component} from 'react'
import {render} from 'react-dom'
import axios from 'axios'
import { userInfo } from 'os';


const Categories = ({newList, selectedCat}) =>{ 
    return (
        <div>
            <h2>Categories</h2>
            <ul>{
                newList.map(category => <li onClick={()=> selectedCat(category.id)} key={category.id}> <h3> {category.name}, {category.products.length} </h3> <hr/></li>)
                }</ul>
        </div>
    )
}

const Category = ({category, selectedCat}) => {
    const {name, id} = category
    const prod = category.products.map((prod) => prod.name)
    console.log(`%%%%%% ${prod}`)
    return (
        <div>
            <h3>{name}</h3>
            <ul>
            {
            category.products.map((prod) =><li key = {prod.id}> {prod.name} </li>)
            }
            </ul>
            <a href=" ">Back</a>
        </div>
    )
}



class App extends Component {
    constructor(){
        super()
        this.state = {
            categories: [],
            category: {},
        }
    this.selectedCategory = this.selectedCategory.bind(this)
    }
    
    async componentDidMount(){
        const response = await axios.get('/api/categories')
        const newSetCategories = await response.data
        this.setState({categories: newSetCategories}) 
        console.log(this.state.categories)
    } 
    
    async selectedCategory(id){
        const response = await axios.get(`/api/categories/${id}`)
        const selectedCat = await response.data
        this.setState({category: selectedCat}) 
    }

    render(){
        const {selectedCategory} = this
        const {categories, category} = this.state
        return(
        category.id ? (<Category category={category}/>) : <Categories newList={categories} selectedCat={selectedCategory}/>
        )}
}

const root = document.getElementById('app')

render(<App/>, root)