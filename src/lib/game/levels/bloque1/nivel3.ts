export const nivel3 = {
  id: 'nivel-3',
  title: 'Cuentas',
  concept: 'Operadores: calcular el total',
  max_steps: 40,
  chef_start_x: 0,
  chef_start_y: 0,
  hint: 'Toma el pescado, córtalo, cocínalo y emplátalo.',
  ingredients: { pescado: { x: 5, y: 1, available: true } },
  stoves: { 'estufa-1': { x: 7, y: 1 } },
  plates: { 'plato-1': { x: 7, y: 3 } },
  orders: [{ items: ['pescado'] }],
};