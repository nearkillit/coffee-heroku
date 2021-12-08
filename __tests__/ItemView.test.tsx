/**
 * @jest-environment jsdom
 */
 import { render, screen, cleanup } from '@testing-library/react'
 import '@testing-library/jest-dom'
 import userEvent from '@testing-library/user-event'
 import { rest } from 'msw'
 import { setupServer } from 'msw/node'
 import { getPage } from 'next-page-tester'
 import { initTestHelpers } from 'next-page-tester'
 import 'setimmediate'
 
 initTestHelpers()
 
 process.env.NEXT_PUBLIC_RESTAPI_URL = 'http://127.0.0.1:8000/api'
 
 const handlers = [
   rest.get(
     `${process.env.NEXT_PUBLIC_RESTAPI_URL}/coffee/`,
     (req, res, ctx) => {
       return res(
         ctx.status(200),
         ctx.json([
           {
            coffee_detail: "test1 detail",
            id: "1",
            img: "test1",
            coffee_name: "test1",
            coffee_priceL: 300,
            coffee_priceM: 400,
           },
           {
            coffee_detail: "test2 detail",
            id: "2",
            img: "test2",
            coffee_name: "test2",
            coffee_priceL: 200,
            coffee_priceM: 500,
           },
         ])
       )
     }
   ),
   rest.get(
     `${process.env.NEXT_PUBLIC_RESTAPI_URL}/topping/`,
     (req, res, ctx) => {
       return res(
         ctx.status(200),
         ctx.json([
            {
             id: "1",    
             topping_name: "test top1",
             topping_priceL: 100,
             topping_priceM: 200,
            },
            {
                id: "2",    
                topping_name: "test top2",
                topping_priceL: 120,
                topping_priceM: 240,
            },
          ])
       )
     }
   ),
 ]
 const server = setupServer(...handlers)
 beforeAll(() => {
   server.listen()
 })
 afterEach(() => {
   server.resetHandlers()
   cleanup()
 })
 afterAll(() => {
   server.close()
 })
 describe(`ItemVIewPage Test Cases`, () => {
   it('Should render text', async () => {
     const { page } = await getPage({
       route: '/',
     })
     render(page)
     expect(await screen.findByText('test1')).toBeInTheDocument()
     userEvent.type(screen.getByPlaceholderText('search'), 'test1')
     userEvent.click(screen.getByTestId('go-search'))     
     expect(screen.queryByText('test2')).toBeNull()    
   })
 })