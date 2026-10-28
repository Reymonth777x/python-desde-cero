export const nivel5 = {
  id: 'nivel-5',
  title: 'Dos platos',
  concept: 'Repetir: atender dos pedidos en secuencia',
  max_steps: 60,
  chef_start_x: 0,
  chef_start_y: 0,
  hint: 'Atiende el primer pedido, luego el segundo. Repite el proceso.',
  ingredients: {
    pollo: { x: 4, y: 2, available: true },
    carne: { x: 6, y: 4, available: true },
  },
  stoves: {
    'estufa-1': { x: 4, y: 4 },
    'estufa-2': { x: 6, y: 2 },
  },
  plates: {
    'plato-1': { x: 2, y: 2 },
    'plato-2': { x: 8, y: 4 },
  },
  orders: [
    { items: ['pollo'] },
    { items: ['carne'] },
  ],
};