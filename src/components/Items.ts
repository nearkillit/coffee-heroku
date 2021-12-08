import { CoffeeState, ToppingState } from '../type/type'

export const GetCoffeeById = (id: string, items: Array<CoffeeState>) => {            
    return items.filter( c => c.id == id)[0] 
}

export const GetToppingById = (id: string, items: Array<ToppingState>) => {        
    return items.filter( c => c.id == id)[0] 
}

export const GetToppingsById = (id: Array<string>, items: Array<ToppingState>) => {        
    return items.filter( c => id.includes(c.id) )
}