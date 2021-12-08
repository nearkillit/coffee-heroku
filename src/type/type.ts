
export type StoreState = {
    Coffee: Array<CoffeeState>,
    Topping: Array<ToppingState>,    
    user: any,      
    cart: CartState,
    orderhistory: OrderhistoryState
}

export type CoffeeState = {
    coffee_detail: string,
    id: string,
    img: string,
    coffee_name: string,
    coffee_priceL: number,
    coffee_priceM: number,
    couponCode?: string
}

export type ToppingState = {    
    id: string,    
    topping_name: string,
    topping_priceL: number,
    topping_priceM: number,
}

export type CartItemListState = {    
    Itemid: string,    
    item_number: number,
    item_size: string,
    subtotal: number,
    id?: string,
    topping_id?: Array<string>,
    Coffee?: CoffeeState,
    Topping?: Array<ToppingState>
}

export type CartState = {
    addressNumber?: string,
    address?: string,
    cartItemList?: Array<CartItemListState>,    
    email?: string,
    order_name?: string,
    order_date?: string,
    order_time?: string,
    status?: number,
    tel?: string,
    carts?: string,
    id?: string,
    user?: string
}

export type OrderhistoryState = CartState[]

export type ItemState = {
    coffee: Array<CoffeeState>
    topping: Array<ToppingState>
}

export type SignUpState = {
    email: string,    
    password1: string,
    password2: string
}

export type LoginState = {
    email: string,
    password: string
}

export type UserDataState = {
    email: string,
    id: string
}