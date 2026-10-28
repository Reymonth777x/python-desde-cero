export const nivel4 = {
  id: 'nivel-4',
  title: 'El cliente pide',
  concept: 'Entrada de datos: recibir el pedido del cliente',
  max_steps: 50,
  chef_start_x: 0,
  chef_start_y: 0,
  hint: 'Lee el pedido, toma el ingrediente solicitado y sírvelo.',
  ingredients: {
    lechuga: { x: 3, y: 3, available: true },
    tomate: { x: 5, y: 3, available: true },
    cebolla: { x: 7, y: 3, available: true },
  },
  stoves: {},
  plates: {},
  orders: [{ items: ['tomate'] }],
};