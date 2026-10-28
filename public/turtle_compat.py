"""Modulo de compatibilidad con Turtle para Pyodide en navegador."""

import math

_commands = []
_turtles = {}
_current = None
_screen = None

_screen_bgcolor = "white"
def _get_turtle():
    global _current
    if _current is None:
        _current = Turtle()
        _turtles["default"] = _current
    return _current


def _get_screen():
    global _screen
    if _screen is None:
        _screen = Screen()
    return _screen


def _radians(degrees):
    return math.radians(degrees)


class Turtle:
    def __init__(self):
        self.x = 0.0
        self.y = 0.0
        self._heading = 0.0
        self.pen_down = True
        self.pen_color = "black"
        self.fill_color = "black"
        self.pen_size = 1
        self._speed = 6
        self.is_visible = True
        self.is_filling = False
        self.fill_points = []

    def forward(self, distance):
        rad = _radians(self._heading)
        new_x = self.x + distance * math.cos(rad)
        new_y = self.y + distance * math.sin(rad)
        if self.pen_down:
            _commands.append({
                "type": "line",
                "x1": self.x,
                "y1": self.y,
                "x2": new_x,
                "y2": new_y,
                "color": self.pen_color,
                "size": self.pen_size,
            })
        self.x = new_x
        self.y = new_y

    def backward(self, distance):
        self.forward(-distance)

    def left(self, angle):
        self._heading = (self._heading + angle) % 360.0

    def right(self, angle):
        self._heading = (self._heading - angle) % 360.0
    def goto(self, x, y=None):
        if y is None:
            self.x, self.y = float(x[0]), float(x[1])
        else:
            if self.pen_down:
                _commands.append({
                    "type": "line",
                    "x1": self.x,
                    "y1": self.y,
                    "x2": float(x),
                    "y2": float(y),
                    "color": self.pen_color,
                    "size": self.pen_size,
                })
            self.x = float(x)
            self.y = float(y)

    def setx(self, x):
        self.goto(float(x), self.y)

    def sety(self, y):
        self.goto(self.x, float(y))

    def penup(self):
        self.pen_down = False

    def pendown(self):
        self.pen_down = True

    def pencolor(self, color=None):
        if color is not None:
            self.pen_color = str(color)
        return self.pen_color

    def fillcolor(self, color=None):
        if color is not None:
            self.fill_color = str(color)
        return self.fill_color

    def color(self, *args):
        if len(args) == 1:
            self.pen_color = str(args[0])
            self.fill_color = str(args[0])
        elif len(args) == 2:
            self.pen_color = str(args[0])
            self.fill_color = str(args[1])

    def pensize(self, size=None):
        if size is not None:
            self.pen_size = float(size)
        return self.pen_size

    def width(self, size=None):
        return self.pensize(size)

    def speed(self, speed=None):
        if speed is not None:
            self._speed = float(speed)
        return self._speed

    def hideturtle(self):
        self.is_visible = False

    def showturtle(self):
        self.is_visible = True

    def position(self):
        return (self.x, self.y)

    def pos(self):
        return self.position()

    def begin_fill(self):
        self.is_filling = True
        self.fill_points = [(self.x, self.y)]

    def end_fill(self):
        if self.is_filling and len(self.fill_points) >= 3:
            _commands.append({
                "type": "fill",
                "points": self.fill_points,
                "color": self.fill_color,
            })
        self.is_filling = False
        self.fill_points = []

    def dot(self, size=None, color=None):
        if size is None:
            size = self.pen_size
        if color is None:
            color = self.pen_color
        _commands.append({
            "type": "dot",
            "x": self.x,
            "y": self.y,
            "size": float(size),
            "color": str(color),
        })

    def circle(self, radius, extent=None):
        if extent is None:
            extent = 360.0
        steps = max(16, int(abs(radius) / 4))
        arc_length = 2 * math.pi * abs(radius) * (abs(extent) / 360.0)
        step_length = arc_length / steps
        step_angle = extent / steps

        for _ in range(steps):
            if self.pen_down:
                _commands.append({
                    "type": "line",
                    "x1": self.x,
                    "y1": self.y,
                    "x2": self.x,
                    "y2": self.y,
                    "color": self.pen_color,
                    "size": self.pen_size,
                })
            rad = _radians(self._heading)
            new_x = self.x + step_length * math.cos(rad)
            new_y = self.y + step_length * math.sin(rad)
            if self.pen_down:
                _commands[-1]["x2"] = new_x
                _commands[-1]["y2"] = new_y
            self.x = new_x
            self.y = new_y
            self.left(step_angle)

    def write(self, text, *args, **kwargs):
        _commands.append({
            "type": "write",
            "x": self.x,
            "y": self.y,
            "text": str(text),
            "color": self.pen_color,
        })
        return self.position()

    def xcor(self):
        return self.x

    def ycor(self):
        return self.y

    def heading(self):
        return self._heading

    def setheading(self, angle):
        self._heading = float(angle) % 360.0

    def home(self):
        self.goto(0.0, 0.0)
        self.setheading(0.0)

    def bgcolor(self, color=None):
        global _screen_bgcolor
        if color is not None:
            _screen_bgcolor = str(color)
        _commands.append({"type": "bgcolor", "color": _screen_bgcolor})
        return _screen_bgcolor

    def clear(self):
        global _commands
        _commands = []
        self.home()
        self.pen_down = True
        self.pen_color = "black"
        self.fill_color = "black"
        self.pen_size = 1

    def reset(self):
        self.clear()

class Screen:
    def __init__(self):
        self.bgcolor_value = "white"

    def bgcolor(self, color=None):
        global _screen_bgcolor
        if color is not None:
            self.bgcolor_value = str(color)
            _screen_bgcolor = self.bgcolor_value
        _commands.append({"type": "bgcolor", "color": _screen_bgcolor})
        return _screen_bgcolor

    def title(self, title=None):
        return self.bgcolor_value

    def done(self):
        pass

    def bye(self):
        global _commands
        _commands = []

    def clearscreen(self):
        global _commands
        _commands = []

    def reset(self):
        self.clearscreen()
        self.title_value = ""


def forward(distance):
    _get_turtle().forward(distance)


def backward(distance):
    _get_turtle().backward(distance)


def left(angle):
    _get_turtle().left(angle)


def right(angle):
    _get_turtle().right(angle)


def goto(x, y=None):
    _get_turtle().goto(x, y)


def setx(x):
    _get_turtle().setx(x)


def sety(y):
    _get_turtle().sety(y)


def penup():
    _get_turtle().penup()


def pendown():
    _get_turtle().pendown()


def pencolor(color=None):
    return _get_turtle().pencolor(color)


def fillcolor(color=None):
    return _get_turtle().fillcolor(color)


def color(*args):
    _get_turtle().color(*args)


def pensize(size=None):
    return _get_turtle().pensize(size)


def width(size=None):
    return _get_turtle().pensize(size)


def speed(speed=None):
    return _get_turtle().speed(speed)


def hideturtle():
    _get_turtle().hideturtle()


def showturtle():
    _get_turtle().showturtle()


def position():
    return _get_turtle().position()


def pos():
    return _get_turtle().pos()


def xcor():
    return _get_turtle().xcor()


def ycor():
    return _get_turtle().ycor()


def heading():
    return _get_turtle().heading()


def setheading(angle):
    _get_turtle().setheading(angle)


def home():
    _get_turtle().home()


def clear():
    _get_turtle().clear()


def reset():
    _get_turtle().reset()


def begin_fill():
    _get_turtle().begin_fill()


def end_fill():
    _get_turtle().end_fill()


def dot(size=None, color=None):
    _get_turtle().dot(size, color)


def circle(radius, extent=None):
    _get_turtle().circle(radius, extent)


def write(text, *args, **kwargs):
    _get_turtle().write(text, *args, **kwargs)


def done():
    pass


def bgcolor(color=None):
    global _screen_bgcolor
    if color is not None:
        _screen_bgcolor = str(color)
    _commands.append({"type": "bgcolor", "color": _screen_bgcolor})
    return _screen_bgcolor


def get_commands():
    return list(_commands)


def clear_commands():
    global _commands
    _commands = []


def mainloop():
    pass


def exitonclick():
    pass


def clear_commands():
    global _commands
    _commands = []

# Registrar el módulo para que "import turtle as t" funcione
sys.modules["turtle"] = sys.modules[__name__]