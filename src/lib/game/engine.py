"""
Motor determinista del juego de cocina.
Procesa comandos del estudiante y genera un registro de eventos.
Sin azar: todo es predecible y reproducible.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class GameEvent:
    type: str
    step: int
    data: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {"type": self.type, "step": self.step, "data": self.data}


@dataclass
class Order:
    id: int
    items: List[str]
    completed: bool = False


class KitchenEngine:
    def __init__(self, level_data: Dict[str, Any]):
        self.level_data = level_data
        self.step_count = 0
        self.max_steps = level_data.get("max_steps", 100)
        self.events: List[GameEvent] = []

        self.chef_x = level_data.get("chef_start_x", 0)
        self.chef_y = level_data.get("chef_start_y", 0)
        self.chef_holding: Optional[str] = None
        self.chef_facing = "right"

        self.ingredients: Dict[str, Dict[str, Any]] = {}
        self.ingredients_data = level_data.get("ingredients", {})
        for ing_id, ing in self.ingredients_data.items():
            self.ingredients[ing_id] = {
                "x": ing.get("x", 0),
                "y": ing.get("y", 0),
                "available": ing.get("available", True),
                "chopped": False,
                "cooked": False,
            }

        self.stoves: Dict[str, Dict[str, Any]] = {}
        self.stoves_data = level_data.get("stoves", {})
        for stove_id, stove in self.stoves_data.items():
            self.stoves[stove_id] = {
                "x": stove.get("x", 0),
                "y": stove.get("y", 0),
                "has_item": False,
                "item": None,
                "cooking": False,
                "cook_progress": 0,
            }

        self.plates: Dict[str, Dict[str, Any]] = {}
        self.plates_data = level_data.get("plates", {})
        for plate_id, plate in self.plates_data.items():
            self.plates[plate_id] = {
                "x": plate.get("x", 0),
                "y": plate.get("y", 0),
                "has_item": False,
                "item": None,
                "served": False,
            }

        self.orders: List[Order] = []
        for i, order_data in enumerate(level_data.get("orders", [])):
            self.orders.append(Order(id=i, items=list(order_data.get("items", []))))
        self.current_order_index = 0

        self.game_over = False
        self.won = False

    def _add_event(self, event_type: str, data: Dict[str, Any] = None) -> None:
    def _add_event(self, event_type: str, data: Dict[str, Any] = None) -> None:
        self.events.append(GameEvent(type=event_type, step=self.step_count, data=data or {}))

    def _get_current_order(self) -> Optional[Order]:
        if self.current_order_index < len(self.orders):
            return self.orders[self.current_order_index]
        return None

    def _order_completed(self) -> bool:
        order = self._get_current_order()
        if order is None:
            return True
        return order.completed

    def _next_order(self) -> None:
        self.current_order_index += 1
        if self.current_order_index >= len(self.orders):
            self.won = True
            self.game_over = True

    def mover(self, direccion: str) -> Dict[str, Any]:
        if self.game_over:
            return {"ok": False, "error": "El juego ya terminó."}

        self.step_count += 1
        if self.step_count > self.max_steps:
            self.game_over = True
            self._add_event("game_over", {"reason": "limite_de_pasos", "steps": self.step_count})
            return {"ok": False, "error": "Límite de pasos alcanzado."}

        dx, dy = 0, 0
        if direccion == "arriba":
            dy = -1
            self.chef_facing = "up"
        elif direccion == "abajo":
            dy = 1
            self.chef_facing = "down"
        elif direccion == "izquierda":
            dx = -1
            self.chef_facing = "left"
        elif direccion == "derecha":
            dx = 1
            self.chef_facing = "right"
        else:
            return {"ok": False, "error": "Dirección no válida."}

        nuevo_x = self.chef_x + dx
        nuevo_y = self.chef_y + dy
    def tomar(self, ingrediente_id: str) -> Dict[str, Any]:
        if self.game_over:
            return {"ok": False, "error": "El juego ya terminó."}

        if self.chef_holding is not None:
            return {"ok": False, "error": "Ya estás sosteniendo algo. Emplátalo primero."}

        self.step_count += 1
        if self.step_count > self.max_steps:
            self.game_over = True
            return {"ok": False, "error": "Límite de pasos alcanzado."}

        ing = self.ingredients.get(ingrediente_id)
        if ing is None:
            return {"ok": False, "error": "Ese ingrediente no existe."}

        if not ing["available"]:
            return {"ok": False, "error": "Ese ingrediente ya no está disponible."}

        distancia = abs(self.chef_x - ing["x"]) + abs(self.chef_y - ing["y"])
        if distancia > 1:
            return {"ok": False, "error": "Estás demasiado lejos del ingrediente.", "distancia": distancia}

        ing["available"] = False
        self.chef_holding = ingrediente_id
        self._add_event("ingrediente_tomado", {"ingrediente": ingrediente_id, "x": ing["x"], "y": ing["y"]})

        return {"ok": True, "ingrediente": ingrediente_id, "holding": self.chef_holding}

    def cortar(self) -> Dict[str, Any]:
        if self.game_over:
            return {"ok": False, "error": "El juego ya terminó."}

        if self.chef_holding is None:
            return {"ok": False, "error": "No estás sosteniendo ningún ingrediente."}

        self.step_count += 1
    def cocinar(self, estufa_id: str) -> Dict[str, Any]:
        if self.game_over:
            return {"ok": False, "error": "El juego ya terminó."}

        if self.chef_holding is None:
            return {"ok": False, "error": "No estás sosteniendo ningún ingrediente."}

        self.step_count += 1
        if self.step_count > self.max_steps:
            self.game_over = True
            return {"ok": False, "error": "Límite de pasos alcanzado."}

        stove = self.stoves.get(estufa_id)
        if stove is None:
            return {"ok": False, "error": "Esa estufa no existe."}

        if stove["has_item"]:
            return {"ok": False, "error": "La estufa ya está ocupada."}

        distancia = abs(self.chef_x - stove["x"]) + abs(self.chef_y - stove["y"])
        if distancia > 1:
            return {"ok": False, "error": "Estás demasiado lejos de la estufa.", "distancia": distancia}

        stove["has_item"] = True
        stove["item"] = self.chef_holding
        stove["cooking"] = True
        stove["cook_progress"] = 0
        self.chef_holding = None
        self._add_event("ingrediente_en_estufa", {"estufa": estufa_id, "ingrediente": stove["item"]})

        return {"ok": True, "estufa": estufa_id, "ingrediente": stove["item"]}

    def emplatar(self, plato_id: str) -> Dict[str, Any]:
        if self.game_over:
            return {"ok": False, "error": "El juego ya terminó."}

        self.step_count += 1
        if self.step_count > self.max_steps:
            self.game_over = True
            return {"ok": False, "error": "Límite de pasos alcanzado."}

        plate = self.plates.get(plato_id)
        if plate is None:
            return {"ok": False, "error": "Ese plato no existe."}

        if plate["has_item"]:
            return {"ok": False, "error": "Ese plato ya tiene algo."}

        ingrediente_cocinado = None
        estufa_origen = None
        for sid, stove in self.stoves.items():
            distancia = abs(self.chef_x - stove["x"]) + abs(self.chef_y - stove["y"])
            if distancia <= 1 and stove["has_item"] and not stove["cooking"]:
                ingrediente_cocinado = stove["item"]
                estufa_origen = sid
                break

        if ingrediente_cocinado is None:
            if self.chef_holding:
                ing = self.ingredients.get(self.chef_holding)
                if ing and ing.get("chopped"):
                    ingrediente_cocinado = self.chef_holding
                    self.chef_holding = None
                else:
                    return {"ok": False, "error": "El ingrediente no está listo para emplatar."}
            else:
                return {"ok": False, "error": "No hay ingrediente cocinado para emplatar."}
    def servir(self, mesa_id: str) -> Dict[str, Any]:
        if self.game_over:
            return {"ok": False, "error": "El juego ya terminó."}

        self.step_count += 1
        if self.step_count > self.max_steps:
            self.game_over = True
            return {"ok": False, "error": "Límite de pasos alcanzado."}

        plato_cerca = None
        for pid, plate in self.plates.items():
            distancia = abs(self.chef_x - plate["x"]) + abs(self.chef_y - plate["y"])
            if distancia <= 1 and plate["has_item"] and not plate["served"]:
                plato_cerca = pid
                break

        if plato_cerca is None:
            return {"ok": False, "error": "No hay plato emplatado cerca para servir."}

        self.plates[plato_cerca]["served"] = True
        self._add_event("plato_servido", {"plato": plato_cerca, "mesa": mesa_id})

        return {"ok": True, "plato": plato_cerca, "mesa": mesa_id}

    def esperar(self, pasos: int = 1) -> Dict[str, Any]:
        if self.game_over:
            return {"ok": False, "error": "El juego ya terminó."}

        for i in range(pasos):
            self.step_count += 1
            if self.step_count > self.max_steps:
                self.game_over = True
                self._add_event("game_over", {"reason": "limite_de_pasos", "steps": self.step_count})
                return {"ok": False, "error": "Límite de pasos alcanzado."}

            for sid, stove in self.stoves.items():
                if stove["cooking"]:
                    stove["cook_progress"] += 1
                    if stove["cook_progress"] >= 3:
                        stove["cooking"] = False
                        self._add_event("ingrediente_cocinado", {"estufa": sid, "ingrediente": stove["item"]})

        self._add_event("espera", {"pasos": pasos})
        return {"ok": True, "steps": self.step_count}

    def hay_pedido(self) -> bool:
        return self._get_current_order() is not None and not self._order_completed()

    def ver_pedido(self) -> Dict[str, Any]:
        order = self._get_current_order()
        if order is None:
            return {"hay_pedido": False}
        return {"hay_pedido": True, "pedido_id": order.id, "items": order.items, "completado": order.completed}

    def get_state(self) -> Dict[str, Any]:
        return {
            "step": self.step_count,
            "max_steps": self.max_steps,
            "chef": {"x": self.chef_x, "y": self.chef_y, "facing": self.chef_facing, "holding": self.chef_holding},
            "ingredients": {k: {"x": v["x"], "y": v["y"], "available": v["available"], "chopped": v["chopped"], "cooked": v["cooked"]} for k, v in self.ingredients.items()},
            "stoves": {k: {"x": v["x"], "y": v["y"], "has_item": v["has_item"], "item": v["item"], "cooking": v["cooking"], "cook_progress": v["cook_progress"]} for k, v in self.stoves.items()},
            "plates": {k: {"x": v["x"], "y": v["y"], "has_item": v["has_item"], "item": v["item"], "served": v["served"]} for k, v in self.plates.items()},
            "orders": [{"id": o.id, "items": o.items, "completed": o.completed} for o in self.orders],
            "current_order_index": self.current_order_index,
            "game_over": self.game_over,
            "won": self.won,
        }

    def get_events(self) -> List[Dict[str, Any]]:
        return [e.to_dict() for e in self.events]

    def reset(self) -> None:
        self.__init__(self.level_data)

        if estufa_origen:
            self.stoves[estufa_origen]["has_item"] = False
            self.stoves[estufa_origen]["item"] = None
            self.stoves[estufa_origen]["cooking"] = False

        plate["has_item"] = True
        plate["item"] = ingrediente_cocinado

        order = self._get_current_order()
        if order and ingrediente_cocinado in order.items and not order.completed:
            order.completed = True
            self._add_event("pedido_completado", {"pedido": order.id})
            self._next_order()

        self._add_event("ingrediente_emplatado", {"plato": plato_id, "ingrediente": ingrediente_cocinado})

        return {"ok": True, "plato": plato_id, "ingrediente": ingrediente_cocinado}
        if self.step_count > self.max_steps:
            self.game_over = True
            return {"ok": False, "error": "Límite de pasos alcanzado."}

        ing_id = self.chef_holding
        ing = self.ingredients.get(ing_id)
        if ing is None or ing["chopped"]:
            return {"ok": False, "error": "No se puede cortar este ingrediente."}

        ing["chopped"] = True
        self._add_event("ingrediente_cortado", {"ingrediente": ing_id})

        return {"ok": True, "ingrediente": ing_id, "chopped": True}

        if nuevo_x < 0 or nuevo_x > 9 or nuevo_y < 0 or nuevo_y > 9:
            self._add_event("movimiento_bloqueado", {"x": self.chef_x, "y": self.chef_y})
            return {"ok": False, "error": "No puedes salir de la cocina."}

        self.chef_x = nuevo_x
        self.chef_y = nuevo_y
        self._add_event("chef_movido", {"x": self.chef_x, "y": self.chef_y, "direccion": direccion})

        return {"ok": True, "x": self.chef_x, "y": self.chef_y, "holding": self.chef_holding}
        self.events.append(GameEvent(type=event_type, step=self.step_count, data=data or {}))

    def _get_current_order(self) -> Optional[Order]:
        if self.current_order_index < len(self.orders):
            return self.orders[self.current_order_index]
        return None

    def _order_completed(self) -> bool:
        order = self._get_current_order()
        if order is None:
            return True
        return order.completed

    def _next_order(self) -> None:
        self.current_order_index += 1
        if self.current_order_index >= len(self.orders):
            self.won = True
            self.game_over = True