export const nivel2 = {
  id: 'nivel-2',
  title: 'Ingredientes',
  concept: 'Variables: guardar un ingrediente',
  max_steps: 40,
  chef_start_x: 0,
  chef_start_y: 0,
  hint: 'Toma el tomate, luego muévete a la estufa y cocínalo.',
  ingredients: { tomate: { x: 4, y: 2, available: true } },
  stoves: { 'estufa-1': { x: 6, y: 2 } },
  plates: {},
  orders: [{ items: ['tomate'] }],
};