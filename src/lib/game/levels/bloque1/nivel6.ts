export const nivel6 = {
  id: 'nivel-6',
  title: 'Servicio exprés',
  concept: 'Jefe del bloque 1: combinar todo lo aprendido',
  max_steps: 80,
  chef_start_x: 0,
  chef_start_y: 0,
  hint: 'Atiende tres pedidos rápidamente. Muévete, toma, cocina y emplata en secuencia.',
  ingredients: {
    pasta: { x: 2, y: 4, available: true },
    arroz: { x: 6, y: 2, available: true },
    ensalada: { x: 8, y: 6, available: true },
  },
  stoves: {
    'estufa-1': { x: 3, y: 4 },
    'estufa-2': { x: 7, y: 2 },
    'estufa-3': { x: 8, y: 5 },
  },
  plates: {
    'plato-1': { x: 1, y: 4 },
    'plato-2': { x: 5, y: 2 },
    'plato-3': { x: 9, y: 6 },
  },
  orders: [
    { items: ['pasta'] },
    { items: ['arroz'] },
    { items: ['ensalada'] },
  ],
};